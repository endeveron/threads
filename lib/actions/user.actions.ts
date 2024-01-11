'use server';

import { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';

import CommunityModel from '@/lib/models/community.model';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { TFetchUsersParams, TUpdateUserParams } from '@/lib/types/user.types';

/**
 * Updates a user's information in a database and revalidates the cache if the path is '/profile/edit'.
 *
 * @param bio biography of the user.
 * @param image user avatar image path.
 * @param name user name.
 * @param path pathname to revalidate cached data.
 * @param userId user._id, MongoDb ObjectId.
 * @param username username.
 */
export const updateUser = async ({
  bio,
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
    throw new Error(`Failed to create/update user: ${err.message}`);
  }
};

/**
 * Fetches a user from a database using their ObjectId.
 *
 * @param userId the user.id property in MongoDb user object.
 * @returns the user object.
 */
export const fetchUser = async (userId: string) => {
  try {
    connectToDB();

    return await UserModel.findOne({ id: userId }).populate({
      path: 'communities',
      model: CommunityModel,
      select: '_id id image name',
    });
  } catch (err: any) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
};

/**
 * Retrieves a list of users from a database based on search criteria, pagination, and sorting options.
 *
 * @param searchQuery a string representing the search query to filter the users. It is optional and defaults to an empty string.
 * @param pageNumber a number is used to specify the page number of the users to fetch. The default value is 1.
 * @param pageSize a number is used to specify the amount of users per page. The default value is 20.
 * @param sortBy is used to specify the sorting order of the fetched users. The default value is `'desc'` stands for descending order, meaning that the users will be sorted in reverse chronological order based on their `createdAt` property.
 * @param userId the user.id property in MongoDb user object.
 * @returns an object { users, isNext }. The `users` property contains an array of user objects that match the search criteria and pagination settings. The `isNext` property is a boolean value indicating whether there are more users available to fetch.
 */
export const fetchUsers = async ({
  searchQuery = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
  userId, // clerk user.id
}: TFetchUsersParams) => {
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

    // Configure the query object
    const usersQuery = UserModel.find(query)
      .sort({ createdAt: sortBy })
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of fetched user objects
    const totalUsersCount = await UserModel.countDocuments(query);

    // Fetch the users
    const users = await usersQuery.exec();

    // Calculating whether there are more users available to fetch
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (err: any) {
    throw new Error(`Failed to fetch users: ${err.message}`);
  }
};

/**
 * Fetches user threads from a database, populating the threads with their children and the author information.
 *
 * @param {string} userId user.id property in MongoDb user object, is used to find the user in the database and
 * retrieve their associated threads.
 * @returns a promise that resolves to the user threads objects.
 */
export const fetchUserThreads = async (userId: string) => {
  try {
    connectToDB();

    const threadsQuery = UserModel.findOne({ id: userId }).populate({
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

    return await threadsQuery.exec();
  } catch (err: any) {
    throw new Error(`Failed to fetch user threads: ${err.message}`);
  }
};

/**
 * Retrieves all replies on the user threads, excluding user own threads, and populates the author information for each reply.
 *
 * @param userId user._id, MongoDb ObjectId.
 * @returns a promise that resolves to an array of thread objects.
 */
export const fetchActivity = async (userId: string) => {
  try {
    connectToDB();

    // Get all threads created by the user
    const userThreads = await ThreadModel.find({ author: userId });

    // Iterate over the user threads and collect all the child thread ids (replies) from the `thread.children` property.
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    // Get all replies on the user threads
    const activityQuery = ThreadModel.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: UserModel,
      select: '_id image name',
    });

    return await activityQuery.exec();
  } catch (err: any) {
    throw new Error(`Failed to fetch user activity: ${err.message}`);
  }
};

// TODO: Implement the fetching user replies

/**
 * Retrieves all the threads that a user has replied to, excluding their own threads, and populates the author information for each reply.
 *
 * @param userId user._id, MongoDb ObjectId.
 * @returns a promise that resolves to an array of thread objects.
 */
export const fetchUserReplies = async (userId: string) => {
  try {
    connectToDB();

    // Get all threads created by the user
    const userThreads = await ThreadModel.find({ author: userId });

    // Iterate over the user threads and collect all the child thread ids (replies) from the `thread.children` property.
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    // Get all threads that the user replied, but exclude the user own threads
    const repliesQuery = ThreadModel.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: UserModel,
      select: '_id image name',
    });

    return await repliesQuery.exec();
  } catch (err: any) {
    throw new Error(`Failed to fetch user activity: ${err.message}`);
  }
};
