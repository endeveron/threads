'use server';

import { FilterQuery, SortOrder } from 'mongoose';

import CommunityModel from '@/lib/models/community.model';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import logger from '@/lib/utils/logger';
import {
  TCreateCommunityParams,
  TUpdateCommunityParams,
} from '@/lib/types/community.types';

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
  } catch (error) {
    logger.r('Error creating community:', error);
    throw error;
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
export async function fetchCommunityDetails(id: string) {
  try {
    connectToDB();

    const communityDetails = await CommunityModel.findOne({ id }).populate([
      'createdBy',
      {
        path: 'members',
        model: UserModel,
        select: 'name username image _id id',
      },
    ]);

    return communityDetails;
  } catch (error) {
    logger.r('Error fetching community details:', error);
    throw error;
  }
}

/**
 * The function fetches community threads from a database, populating the author and children fields
 * with additional information.
 *
 * @param {string} id community._id, MongoDb ObjectId of the community.
 *
 * @returns the community posts with their associated threads. The threads are populated with the
 * author information and any child threads are also populated with their author information.
 */
export async function fetchCommunityThreads(id: string) {
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
  } catch (error) {
    logger.r('Error fetching community posts:', error);
    throw error;
  }
}

/**
 * The function fetchCommunities fetches a list of communities based on search criteria, pagination,
 * and sorting options.
 * @param {number} params.searchQuery string used to search for communities. It is optional and defaults to an empty string.
 * @param {number} params.pageNumber a number is used to specify the page number of the communities to fetch. The default value is 1.
 * @param {number} params.pageSize a number is used to specify the amount of communities per page. The default value is 20.
 * @param {Mongoose.SortOrder} params.sortBy is used to specify the sorting order of the fetched communities. The default value is `'desc'` stands for descending order, meaning that the communities will be sorted in reverse chronological order based on their `createdAt` property.
 *
 * @returns an object with two properties: "communities" and "isNext". The "communities" property
 * contains an array of fetched communities that match the search and sort criteria. The "isNext"
 * property is a boolean value indicating whether there are more communities beyond the current page.
 */
export async function fetchCommunities({
  searchQuery = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  searchQuery?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
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
    const communitiesQuery = CommunityModel.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate('members');

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await CommunityModel.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    logger.r('Error fetching communities:', error);
    throw error;
  }
}

/**
 * Adds a member to a community by updating the community's members array and the user's communities array.
 *
 * @param {string} communityId community.id, ClerkId of the community.
 * @param {string} memberId user.id, ClerkId of the member.
 *
 * @returns the community object after adding a member to it.
 */
export async function addUserToCommunity(userId: string, communityId: string) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await CommunityModel.findOne({ id: communityId });

    if (!community) {
      throw new Error('Community not found');
    }

    // Find the user by their unique id
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error('User is already a member of the community');
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    logger.r('Error adding member to community:', error);
    throw error;
  }
}

/**
 * The function removes a user from a community by updating the members array in the community and the
 * communities array in the user.
 *
 * @param {string} userId user.id, ClerkId of the user which will be removed.
 * @param {string} communityId community.id, ClerkId of the community from the user will be removed.
 *
 * @returns an object with a property "success" set to true.
 */
export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
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
  } catch (error) {
    logger.r('Error removing user from community:', error);
    throw error;
  }
}

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
export async function updateCommunityInfo({
  id,
  name,
  username,
  image,
}: TUpdateCommunityParams) {
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
  } catch (error) {
    logger.r('Error updating community information:', error);
    throw error;
  }
}

/**
 * Deletes a community and all associated threads, removes the community from the 'communities' array for each user, and returns the deleted community.
 *
 * @param {string} id community.id, ClerkId of the community.
 *
 * @returns the deleted community object.
 */
export async function deleteCommunity(id: string) {
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
  } catch (error) {
    logger.r('Error deleting community: ', error);
    throw error;
  }
}
