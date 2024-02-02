'use server';

import { FilterQuery, SortOrder } from 'mongoose';

import CommunityModel from '@/lib/models/community.model';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import {
  TAcceptJoinCommunityParams,
  TCreateCommunityParams,
  TRequestJoinCommunityParams,
  TSuggestedCommunity,
  TUpdateCommunityParams,
} from '@/lib/types/community.types';
import { handleActionError } from '@/lib/utils/error';
import logger from '@/lib/utils/logger';
import { revalidatePath } from 'next/cache';

/**
 * The function creates a new community with the provided details and associates it with a user.
 *
 * @param {string} params.id community.id, ClerkId of the community.
 * @param {string} params.name name of the community.
 * @param {string} params.username username of the community.
 * @param {string} params.image community avatar image path.
 * @param {string} params.bio about the community.
 * @param {string} params.createdById author's user._id, MongoDb ObjectId.
 *
 * @returns the createdCommunity object.
 */
export const createCommunity = async ({
  id,
  name,
  username,
  image,
  bio,
  createdById,
}: TCreateCommunityParams) => {
  try {
    connectToDB();

    // Find the user with the provided unique id
    const user = await UserModel.findOne({ id: createdById });

    if (!user) {
      throw new Error('User not found'); // Handle the case if the user with the id is not found
    }

    const newCommunity = new CommunityModel({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();

    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (err: any) {
    handleActionError('Could not create community', err);
  }
};

/**
 * The function fetches community details by connecting to a database and retrieving information about
 * the community and its members.
 *
 * @param {string} id community.id, ClerkId of the community.
 *
 * @returns the community details, which is an object containing information about the community.
 */
export const fetchCommunityDetails = async (id: string) => {
  try {
    connectToDB();

    return await CommunityModel.findOne({ id }).populate([
      'createdBy',
      {
        path: 'members',
        model: UserModel,
        select: 'name username image id', // TCommunityDetailsItem
      },
      {
        path: 'requests',
        model: UserModel,
        select: 'name username email image id', // TCommunityDetailsRequestItem
      },
    ]);
  } catch (err: any) {
    console.log('err', err);
    handleActionError('Could not fetch community details', err);
  }
};

/**
 * The function fetches community threads from a database, populating the author and children fields
 * with additional information.
 *
 * @param {string} id community._id, MongoDb ObjectId of the community.
 *
 * @returns the community posts with their associated threads. The threads are populated with the
 * author information and any child threads are also populated with their author information.
 */
export const fetchCommunityThreads = async (id: string) => {
  try {
    connectToDB();

    const communityPosts = await CommunityModel.findById(id).populate({
      path: 'threads',
      model: ThreadModel,
      populate: [
        {
          path: 'author',
          model: UserModel,
          select: '_id id image name',
        },
        {
          path: 'children',
          model: ThreadModel,
          populate: {
            path: 'author',
            model: UserModel,
            select: '_id id image',
          },
        },
      ],
    });

    return communityPosts;
  } catch (err: any) {
    handleActionError('Could not fetch community threads', err);
  }
};

/**
 * Fetches a list of communities based on search criteria, pagination, and sorting options.
 *
 * @param {number} params.searchQuery string used to search for communities. It is optional and defaults to an empty string.
 * @param {number} params.pageNumber a number is used to specify the page number of the communities to fetch. The default value is 1.
 * @param {number} params.pageSize a number is used to specify the amount of communities per page. The default value is 20.
 * @param {Mongoose.SortOrder} params.sortBy is used to specify the sorting order of the fetched communities. The default value is `'desc'` stands for descending order, meaning that the communities will be sorted in reverse chronological order based on their `createdAt` property.
 *
 * @returns an object with two properties: "communities" and "isNext". The "communities" property
 * contains an array of fetched communities that match the search and sort criteria. The "isNext"
 * property is a boolean value indicating whether there are more communities beyond the current page.
 */
export const fetchCommunities = async ({
  searchQuery = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  searchQuery?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchQuery, 'i');

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof CommunityModel> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchQuery.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communities = await CommunityModel.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate('members');

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await CommunityModel.countDocuments(query);

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (err: any) {
    handleActionError('Could not fetch communities', err);
  }
};

/**
 * Fetches a specified number of suggested communities from a database, sorted by the number of members.
 *
 * @param {number} params.number the number of suggested communities to fetch. It is an optional parameter and
 * defaults to 10 if not provided.
 *
 * @returns a promise that resolves to an array of objects of type TSuggestedCommunity or undefined.
 */
export const fetchSuggestedCommunities = async ({
  number = 10,
}: {
  number?: number;
}): Promise<TSuggestedCommunity[] | undefined> => {
  try {
    connectToDB();

    // Fetch the communities
    return await CommunityModel.aggregate([
      {
        $project: {
          id: 1,
          name: 1,
          username: 1,
          image: 1,
          members: 1,
          membersLength: { $size: '$members' },
        },
      },
      // Sort communities by number of members in descending order
      { $sort: { membersLength: -1 } },
    ]).limit(number);
  } catch (err: any) {
    handleActionError('Could not fetch communities', err);
  }
};

/**
 * Adds a user to a community by updating the user's `communities` array, the community's `members` array and the community's `requests` array.
 *
 * @param {string} userId user.id, ClerkId of the member.
 * @param {string} communityId community.id, ClerkId of the community.
 *
 * @returns the updated community object after adding the user as a member.
 */
export const addUserToCommunity = async (
  userId: string,
  communityId: string
) => {
  try {
    connectToDB();

    // Find the community by ObjectId
    const community = await CommunityModel.findOne({ id: communityId });
    if (!community) throw new Error('Community not found');

    // Find the user by clerk id
    const user = await UserModel.findOne({ id: userId });
    if (!user) throw new Error('User not found');

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error('User is already a member of the community');
    }

    // Add the community's _id to the `user.communities` array
    user.communities.push(community._id);

    // Add the user's _id to the `community.members` array
    community.members.push(user._id);

    // Remove the user's _id from the `community.requests` array
    const reqIndex = community.requests.indexOf(user._id);
    if (reqIndex !== -1) {
      community.requests = [...community.requests].splice(reqIndex, 1);
    }

    await user.save();
    await community.save();

    return community;
  } catch (err: any) {
    handleActionError('Could not add a user to the community', err);
  }
};

/**
 * Removes a user from a community by updating the members array in the community and the
 * communities array in the user.
 *
 * @param {string} userId user.id, ClerkId of the user which will be removed.
 * @param {string} communityId community.id, ClerkId of the community from the user will be removed.
 *
 * @returns an object with a property "success" set to true.
 */
export const removeUserFromCommunity = async (
  userId: string,
  communityId: string
) => {
  try {
    connectToDB();

    const userIdObject = await UserModel.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await CommunityModel.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error('User not found');
    }

    if (!communityIdObject) {
      throw new Error('Community not found');
    }

    // Remove the user's _id from the members array in the community
    await CommunityModel.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await UserModel.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (err: any) {
    handleActionError('Unable to remove a user from the community', err);
  }
};

/**
 * Updates the information of a community in a database.
 *
 * @param {string} params.id community.id, ClerkId of the community that needs to be updated.
 * @param {string} params.name name of the community.
 * @param {string} params.username username of the community.
 * @param {string} params.params.image community avatar image path.
 *
 * @returns the updated community object.
 */
export const updateCommunityInfo = async ({
  id,
  name,
  username,
  image,
}: TUpdateCommunityParams) => {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await CommunityModel.findOneAndUpdate(
      { id },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error('Community not found');
    }

    return updatedCommunity;
  } catch (err: any) {
    handleActionError('Could not update community data', err);
  }
};

/**
 * Deletes a community and all associated threads, removes the community from the 'communities' array for each user, and returns the deleted community.
 *
 * @param {string} id community.id, ClerkId of the community.
 *
 * @returns the deleted community object.
 */
export const deleteCommunity = async (id: string) => {
  try {
    connectToDB();

    const communityResult = await CommunityModel.find({ id });
    if (!communityResult?.length) throw new Error('Community not found');

    const community = communityResult[0];
    const communityObjectId = community._id;

    // Delete all threads associated with the community
    await ThreadModel.deleteMany({ community: communityObjectId });

    // Find all users who are part of the community
    const communityUsers = await UserModel.find({
      communities: communityObjectId,
    });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityObjectId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    // Delete the community
    const deletedCommunity = await community.deleteOne();

    return deletedCommunity;
  } catch (err: any) {
    handleActionError('Unable to delete the community', err);
  }
};

export const requestJoinCommunity = async ({
  communityId,
  userObjectId,
  path,
}: TRequestJoinCommunityParams) => {
  try {
    connectToDB();

    // Find the user by objectId
    const user = await UserModel.findById(userObjectId);
    if (!user) throw new Error('User not found');

    // Find the community by clerk id
    const community = await CommunityModel.findOne({ id: communityId });
    if (!community) throw new Error('Community not found');

    community.requests.push(user._id);
    await community.save();

    revalidatePath(path);
  } catch (err: any) {
    handleActionError('Could not add member to community', err);
  }
};

// Only removes the user from `community.requests` array
// If user approves the email invitation, adding user will be handled by `addUserToCommunity`
export const acceptJoinCommunity = async ({
  userId,
  communityId,
  path,
}: TAcceptJoinCommunityParams) => {
  try {
    connectToDB();

    // Find the user by objectId
    const user = await UserModel.findById({ id: userId });
    if (!user) throw new Error('User not found');

    // Find the community by clerk id
    const community = await CommunityModel.findOne({ id: communityId });
    if (!community) throw new Error('Community not found');

    // Remove the user's _id from the `community.requests` array
    const reqIndex = community.requests.indexOf(user._id);
    if (reqIndex !== -1) {
      community.requests = [...community.requests].splice(reqIndex, 1);
    }
    await community.save();

    revalidatePath(path);
  } catch (err: any) {
    handleActionError('Could not accept a user into the community', err);
  }
};

export const test = async (path: string) => {
  try {
    revalidatePath(path);
  } catch (err: any) {
    handleActionError('Test', err);
  }
};
