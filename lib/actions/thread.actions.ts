'use server';

import { connectToDB } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';

import CommunityModel from '@/lib/models/community.model';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';
import {
  TAddCommentToThreadParams,
  TCreateThreadParams,
  TFetchThreadsParams,
  TReactToThreadParams,
} from '@/lib/types/thread.types';
import logger from '@/lib/utils/logger';

/**
 * Creates a new thread object in MongoDb, updates the user model, and revalidates the cached data.
 *
 * @param {string} params.author user MongoDb ObjectId
 * @param {string} params.communityId Clerk community id
 * @param {string} params.path the pathname to revalidate cached data (i.e. '/profile/edit')
 * @param {string} params.text the thread text content
 */
export const createThread = async ({
  author,
  communityId,
  path,
  text,
}: TCreateThreadParams) => {
  try {
    connectToDB();
    let community;
    let communityObjId = null;

    // The 'communityId' prop is the ID given by the Clerk service.
    // But the 'community' prop of the thread object must be an MongoDb ObjectId type.
    // Therefore if 'communityId' is provided, we must fetch the community ObjectId from the MongoDb
    if (communityId !== null) {
      community = await CommunityModel.findOne({ id: communityId });
      communityObjId = community?._id?.toString();
    }

    // Create new thread
    const thread = await ThreadModel.create({
      text,
      author,
      community: communityObjId,
    });

    // Update user model
    await UserModel.findByIdAndUpdate(author, {
      $push: { threads: thread._id },
    });

    // if 'communityId' is provided, add thread to community 'threads' prop
    if (community) {
      community.threads.push(thread._id);
      await community.save();
    }

    // Update cached data
    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Failed to create thread: ${err.message}`);
  }
};

/**
 * Fetches a specified number of top-level threads from a database, along with their authors and any
 * child threads, and returns them along with a flag indicating if there are more threads available.
 *
 * @param {number} params.pageNumber a number is used to specify the page number of the threads to fetch. The default value is 1.
 * @param {number} params.pageSize a number is used to specify the amount of threads per page. The default value is 20.
 *
 * @returns an object { threads, isNext }. The `threads` property contains an array of fetched threads,
 * and the `isNext` property is a boolean value indicating whether there are more threads available to fetch.
 */
export const fetchThreads = async ({
  pageNumber = 1,
  pageSize = 20,
}: TFetchThreadsParams) => {
  try {
    connectToDB();

    // Calculate the number of threads to skip based on the page number and page size
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the threads that have no parents (top level threads that is not a comment/reply)
    const threadsQuery = ThreadModel.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: 'author',
        model: UserModel,
        select: 'id image name username',
      })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: UserModel,
          select: 'id image name username',
        },
      })
      .populate({
        path: 'community',
        model: CommunityModel,
        select: 'id image name',
      });

    // Count the total number of top-level threads that are not comments
    const totalThreadsCount = await ThreadModel.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    // Fetch the threads
    const threads = await threadsQuery.exec();

    // Calculating whether there are more threads available to fetch
    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (err: any) {
    throw new Error(`Failed to fetch threads: ${err.message}`);
  }
};

/**
 * Fetches a thread by its _id from a database, populating it with related author and child thread information.
 *
 * @param {string} threadId thread._id, MongoDb ObjectId parameter of the thread.
 *
 * @returns a promise that resolves to the fetched thread object.
 */
export const fetchThreadById = async (threadId: string) => {
  try {
    connectToDB();

    const threadQuery = ThreadModel.findById(threadId)
      .populate({
        path: 'author',
        model: UserModel,
        select: 'id name image',
      })
      .populate({
        path: 'community',
        model: CommunityModel,
        select: 'id image name username',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: UserModel,
            select: 'id image name username',
          },
          {
            path: 'children',
            model: ThreadModel,
            populate: {
              path: 'author',
              model: UserModel,
              select: 'id image name username',
            },
          },
        ],
      });

    return await threadQuery.exec();
  } catch (err: any) {
    throw new Error(`Failed to fetch thread: ${err.message}`);
  }
};

/**
 * Adds a comment to a thread by creating a new comment thread, linking it to the original thread,
 * and updating the original thread's children array.
 *
 * @param {string} params.threadId thread._id, MongoDb ObjectId parameter of the thread.
 * @param {string} params.commentText the text of the comment.
 * @param {string} params.userObjectId the author's _id MongoDb ObjectId.
 * @param {string} params.path the pathname to revalidate cached data.
 */
export const addCommentToThread = async ({
  threadId,
  commentText,
  userObjectIdStr,
  path,
}: TAddCommentToThreadParams) => {
  try {
    connectToDB();

    // Find the original thread by its ObjectId
    const originalThread = await ThreadModel.findById(threadId);

    if (!originalThread) {
      throw new Error('Thread not found');
    }

    // Create the new comment thread
    const commentThread = new ThreadModel({
      text: commentText,
      author: userObjectIdStr,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Failed to add comment to thread: ${err.message}`);
  }
};

/**
 * Adds user reaction on the thread by adding or removing userId to the 'thread.likes' property of the thread MongoDb object.
 *
 * @param {string} params.threadId thread._id, MongoDb ObjectId parameter of the thread.
 * @param {string} params.userId the author's _id MongoDb ObjectId.
 * @param {string} params.path the pathname to revalidate cached data.
 */
export const reactToThread = async ({
  threadId,
  userObjectIdStr,
  path,
}: TReactToThreadParams): Promise<{ error: { message: string } | null }> => {
  try {
    connectToDB();

    // Find the original thread by its ObjectId
    const thread = await ThreadModel.findById(threadId);

    if (!thread) throw new Error('Thread not found');

    // logger.b('thread', thread);
    // logger.b('userObjectIdStr', userObjectIdStr);
    // logger.b('path', path);

    // Add / remove the user ID to the copy of thread's 'likes' list
    const updThreadLikes = thread.likes.slice();
    updThreadLikes.includes(userObjectIdStr)
      ? updThreadLikes.splice(updThreadLikes.indexOf(userObjectIdStr), 1)
      : updThreadLikes.push(userObjectIdStr);

    // Save the updated original thread to the database
    thread.likes = updThreadLikes;
    await thread.save();

    revalidatePath(path);

    return { error: null };
  } catch (err: any) {
    throw new Error(`Failed to add comment to thread: ${err.message}`);
  }
};
