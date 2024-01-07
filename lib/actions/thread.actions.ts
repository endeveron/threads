'use server';

import { connectToDB } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';

import {
  TAddCommentToThreadParams,
  TCreateThreadParams,
  TFetchThreadsParams,
} from '@/lib/types/thread.types';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';
import CommunityModel from '@/lib/models/community.model';

/**
 * Creates a new thread object in MongoDb, updates the user model, and revalidates the cached data.
 *
 * @param author user MongoDb ObjectId
 * @param communityId
 * @param path the pathname to revalidate cached data (i.e. '/profile/edit')
 * @param text the thread text content
 */
export const createThread = async ({
  author,
  communityId,
  path,
  text,
}: TCreateThreadParams) => {
  try {
    connectToDB();

    // Create new thread
    const thread = await ThreadModel.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await UserModel.findByIdAndUpdate(author, {
      $push: { threads: thread._id },
    });

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
 * @param pageNumber is used to specify the page number of the threads to fetch. The default value is 1.
 * @param pageSize is used to specify the amount of threads per page. The default value is 20.
 * @returns an object { threads, isNext }. The `threads` property contains an array of fetched threads,
 * and the `isNext` property is a boolean value indicating whether there are more threads available to fetch.
 */
export const fetchThreads = async ({
  pageNumber = 1,
  pageSize = 20,
}: TFetchThreadsParams) => {
  try {
    connectToDB();

    // Calculate the number of threads to skip
    // based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the threads that have no parents
    // (top level threads that is not a comment/reply)
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
      });

    // Count the total number of top-level threads that are not comments.
    const totalThreadsCount = await ThreadModel.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    // Returns exactly a promise. Allows to get
    // a better stack trace if any error happened
    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (err: any) {
    throw new Error(`Failed to fetch threads: ${err.message}`);
  }
};

/**
 * Fetches a thread by its _id from a database, populating it with related author and child thread information.
 *
 * @param {string} threadId the thread._id MongoDb ObjectId parameter.
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
      // .populate({
      //   path: 'community',
      //   model: CommunityModel,
      //   select: 'id image name username',
      // })
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
 * @param threadId the thread._id MongoDb ObjectId parameter.
 * @param commentText the text of the comment.
 * @param userId the author's _id MongoDb ObjectId.
 * @param path the pathname to revalidate cached data.
 */
export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
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
      author: userId,
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
