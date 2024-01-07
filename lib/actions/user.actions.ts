'use server';

import { revalidatePath } from 'next/cache';

import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { TFetchUsersParams, TUpdateUserParams } from '@/lib/types/user.types';
import ThreadModel from '@/lib/models/thread.model';
import { FilterQuery } from 'mongoose';

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

    return await UserModel.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: CommunityModel,
    // });
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
 * Fetches user threads from MongoDb.
 * Populates children threads and author data.
 *
 * @param userId user.id in MongoDb user object, clerk user identifier
 */

/**
 * Fetches user threads from a database, populating the threads with their children and the author information.
 *
 * @param {string} userId user.id property in MongoDb user object, is used to find the user in the database and
 * retrieve their associated threads.
 * @returns a promise that resolves to the user threads data.
 */
export const fetchUserThreads = async (userId: string) => {
  try {
    connectToDB();

    const threadsQuery = UserModel.findOne({ id: userId }).populate({
      path: 'threads',
      model: ThreadModel,
      populate: {
        path: 'children',
        model: ThreadModel,
        populate: {
          path: 'author',
          model: UserModel,
          select: '_id id image name',
        },
      },
    });

    return await threadsQuery.exec();
  } catch (err: any) {
    throw new Error(`Failed to fetch user threads: ${err.message}`);
  }
};
