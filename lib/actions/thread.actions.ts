'use server';

import { revalidatePath } from 'next/cache';

import { connectToDB } from '@/lib/mongoose';
import {
  TCreateThreadParams,
  TFetchThreadsParams,
} from '@/lib/types/thread.types';
import ThreadModel from '@/lib/models/thread.model';
import UserModel from '@/lib/models/user.model';

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
        model: 'User',
        select: '_id image name username',
      })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: 'User',
          select: '_id image name username',
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
