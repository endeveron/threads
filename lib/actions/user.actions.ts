'use server';

import { FilterQuery, ObjectId } from 'mongoose';
import { revalidatePath } from 'next/cache';

import CommunityModel from '@/lib/models/community.model';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import {
  TFetchUsersParams,
  TSuggestedUser,
  TUpdateUserParams,
  TUser,
} from '@/lib/types/user.types';
import { handleActionError } from '@/lib/utils/error';
import {
  TFetchUserRepliesParams,
  TThreadReplyPopulated,
} from '@/lib/types/thread.types';

/**
 * Updates a user's information in a database and revalidates the cache if the path is '/profile/edit'.
 *
 * @param {string} params.bio biography of the user.
 * @param {string} params.email email of the user.
 * @param {string} params.image user avatar image path.
 * @param {string} params.name user name.
 * @param {string} params.path pathname to revalidate cached data.
 * @param {string} params.userId user._id, MongoDb ObjectId of the user.
 * @param {string} params.username username.
 */
export const updateUser = async ({
  bio,
  email,
  image,
  name,
  path,
  userId,
  username,
}: TUpdateUserParams): Promise<void> => {
  try {
    connectToDB();

    await UserModel.findOneAndUpdate(
      { id: userId },
      {
        bio,
        email,
        image,
        name,
        onboarded: true,
        username: username.toLowerCase(),
      },
      {
        upsert: true,
      }
    );

    if (path === '/profile/edit') {
      // Update cached data
      // https://nextjs.org/docs/app/api-reference/functions/revalidatePath
      revalidatePath(path);
    }
  } catch (err: any) {
    handleActionError('Could not create / update user', err);
  }
};

/**
 * Fetches a user from a database using their ObjectId.
 *
 * @param userId the user.id property in MongoDb user object.
 *
 * @returns the user object.
 */
export const fetchUser = async (userId: string): Promise<TUser | undefined> => {
  try {
    connectToDB();

    return await UserModel.findOne({ id: userId }).populate({
      path: 'communities',
      model: CommunityModel,
      select: '_id id image name',
    });
  } catch (err: any) {
    handleActionError('Could not fetch user', err);
  }
};

/**
 * Retrieves a list of users from a database based on search criteria, pagination, and sorting options.
 *
 * @param {string} params.searchQuery a string representing the search query to filter the users. It is optional and defaults to an empty string.
 * @param {number} params.pageNumber a number is used to specify the page number of the users to fetch. The default value is 1.
 * @param {number} params.pageSize a number is used to specify the amount of users per page. The default value is 20.
 * @param {Mongoose.SortOrder} params.sortBy is used to specify the sorting order of the fetched users. The default value is `'desc'` stands for descending order, meaning that the users will be sorted in reverse chronological order based on their `createdAt` property.
 * @param {string} params.userId the user.id property in MongoDb user object.
 *
 * @returns an object { users, isNext }. The `users` property contains an array of user objects that match the search criteria and pagination settings. The `isNext` property is a boolean value indicating whether there are more users available to fetch.
 */
export const fetchUsers = async ({
  searchQuery = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
  userId, // clerk user.id
}: TFetchUsersParams): Promise<
  { users: TUser[]; isNext: boolean } | undefined
> => {
  try {
    connectToDB();

    // Calculate the number of threads to skip based on the page number and page size
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a regular expression object that takes the search query converted to lowercase
    const regex = new RegExp(searchQuery, 'i');

    // Exclude the current user from the search results
    const query: FilterQuery<typeof UserModel> = {
      id: { $ne: userId },
    };

    // We will search by user name or username
    if (searchQuery.trim() !== '') {
      query.$or = [
        { name: { $regex: regex } },
        { username: { $regex: regex } },
      ];
    }

    // Fetch user objects
    const users = await UserModel.find(query)
      .sort({ createdAt: sortBy })
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of fetched user objects
    const totalUsersCount = await UserModel.countDocuments(query);

    // Calculating whether there are more users available to fetch
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (err: any) {
    handleActionError('Could not fetch users', err);
  }
};

/**
 * Retrieves a list of users from a database based on search criteria, pagination, and sorting options.
 *
 * @param {string} params.searchQuery a string representing the search query to filter the users. It is optional and defaults to an empty string.
 * @param {number} params.pageNumber a number is used to specify the page number of the users to fetch. The default value is 1.
 * @param {number} params.pageSize a number is used to specify the amount of users per page. The default value is 20.
 * @param {Mongoose.SortOrder} params.sortBy is used to specify the sorting order of the fetched users. The default value is `'desc'` stands for descending order, meaning that the users will be sorted in reverse chronological order based on their `createdAt` property.
 * @param {string} params.userId the user.id property in MongoDb user object.
 *
 * @returns an object { users, isNext }. The `users` property contains an array of user objects that match the search criteria and pagination settings. The `isNext` property is a boolean value indicating whether there are more users available to fetch.
 */
export const fetchSuggestedUsers = async ({
  authUserId,
  number = 10,
}: {
  number?: number;
  authUserId?: string;
}): Promise<TSuggestedUser[] | undefined> => {
  try {
    connectToDB();

    // Fetch the users
    const users = await UserModel.aggregate([
      {
        $project: {
          id: 1,
          name: 1,
          username: 1,
          image: 1,
          threads: 1,
          threadsLength: { $size: '$threads' },
        },
      },
      // Sort users by number of created threads in descending order
      { $sort: { threadsLength: -1 } },
    ]).limit(number);

    if (authUserId) {
      return users.filter((user) => user.id !== authUserId);
    }

    return users;
  } catch (err: any) {
    handleActionError('Could not fetch users', err);
  }
};

/**
 * Fetches user threads from a database, populating the threads with their children and the author information.
 *
 * @param {string} userId user.id property in MongoDb user object.
 *
 * @returns a promise that resolves to the user threads objects.
 */
export const fetchUserThreads = async (userId: string) => {
  try {
    connectToDB();

    return await UserModel.findOne({ id: userId }).populate({
      path: 'threads',
      model: ThreadModel,
      populate: [
        {
          path: 'children',
          model: ThreadModel,
          populate: [
            {
              path: 'author',
              model: UserModel,
              select: '_id id image name',
            },
          ],
        },
        {
          path: 'community',
          model: CommunityModel,
          select: '_id id image name',
        },
      ],
    });
  } catch (err: any) {
    handleActionError('Could not fetch threads', err);
  }
};

/**
 * Retrieves all replies on the user threads, excluding user own threads, and populates the author information for each reply.
 *
 * @param {string} userObjectId user._id, MongoDb ObjectId of the user.
 *
 * @returns a promise that resolves to an array of thread objects.
 */
export const fetchActivity = async (userObjectId?: ObjectId) => {
  try {
    connectToDB();

    // Get all threads created by the user
    const userThreads = await ThreadModel.find({ author: userObjectId });

    // Iterate over the user threads and collect all the child thread ids (replies) from the `thread.children` property.
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    // Get all replies on the user threads
    return await ThreadModel.find({
      _id: { $in: childThreadIds },
      author: { $ne: userObjectId },
    }).populate({
      path: 'author',
      model: UserModel,
      select: '_id image name',
    });
  } catch (err: any) {
    handleActionError('Could not fetch activity', err);
  }
};

/**
 * Retrieves all the threads that a user has replied to, excluding their own threads, and populates the author information for each reply.
 *
 * @param {string} params.userObjectId user._id, MongoDb ObjectId of the user.
 * @param {number} params.pageNumber a number is used to specify the page number of the threads to fetch. The default value is 1.
 * @param {number} params.pageSize a number is used to specify the amount of threads per page. The default value is 20.
 *
 * @returns a promise that resolves to an array of thread objects.
 */
export const fetchUserReplies = async ({
  replyIdList,
}: TFetchUserRepliesParams): Promise<TThreadReplyPopulated[] | undefined> => {
  try {
    connectToDB();

    // // Calculate the number of threads to skip based on the page number and page size
    // const skipAmount = (pageNumber - 1) * pageSize;

    return await ThreadModel.find({
      _id: { $in: replyIdList },
    })
      .sort({ createdAt: 'desc' })
      .select('-children')
      .populate({
        // TUserItemData
        path: 'author',
        model: UserModel,
        select: '_id id image name username',
      })
      .populate({
        path: 'parent',
        model: ThreadModel,
        select: '_id text',
        populate: {
          // TUserItemData
          path: 'author',
          model: UserModel,
          select: '_id id image name username',
        },
      })
      .populate({
        // TItemData
        path: 'community',
        model: CommunityModel,
        select: '_id id image name',
      });
  } catch (err: any) {
    handleActionError('Could not fetch threads', err);
  }
};
