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

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: TCreateThreadParams) => {
  try {
    connectToDB();

    // Create a new thread
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

export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
  path,
}: TAddCommentToThreadParams) => {
  try {
    connectToDB();

    // Find the original thread by its ID
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
