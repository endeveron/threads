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
  TThread,
  TThreadPopulated,
} from '@/lib/types/thread.types';
import { handleActionError } from '@/lib/utils/error';

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
    // But the 'community' prop of a thread object must be an MongoDb ObjectId type.
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
    handleActionError('Could not create a thread', err);
  }
};

const fetchAllChildThreads = async (
  threadObjectIdStr: string
): Promise<TThread[]> => {
  const childThreads = await ThreadModel.find({ parent: threadObjectIdStr });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id.toString());
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
};

export const deleteThread = async (
  threadObjectIdStr: string,
  path: string
): Promise<void> => {
  try {
    connectToDB();
    // Find a thread to be deleted (the main thread)
    const mainThread = await ThreadModel.findById(threadObjectIdStr).populate(
      'author community'
    );
    if (!mainThread) {
      throw new Error('Thread not found');
    }
    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(threadObjectIdStr);
    // Create a thread id list that includes the main thread id and child thread ids
    const threadIdList = [
      threadObjectIdStr,
      ...descendantThreads.map((thread) => thread._id.toString()),
    ];
    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?.toString()),
        mainThread.author._id.toString(),
      ].filter((id) => id !== undefined)
    );
    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?.toString()),
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );
    // Recursively delete threads and their descendants
    await ThreadModel.deleteMany({ _id: { $in: threadIdList } });
    // Update User model
    await UserModel.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: threadIdList } } }
    );
    // Update Community model
    await CommunityModel.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: threadIdList } } }
    );
    revalidatePath(path);
  } catch (err: any) {
    handleActionError('Could not delete a thread', err);
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
    const threads: TThreadPopulated[] = await ThreadModel.find({
      parent: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        // TUserItemData
        path: 'author',
        model: UserModel,
        select: '_id id image name username',
      })
      .populate({
        path: 'children',
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

    // Count the total number of top-level threads that are not comments
    const totalThreadsCount = await ThreadModel.countDocuments({
      parent: { $in: [null, undefined] },
    });

    // Calculating whether there are more threads available to fetch
    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (err: any) {
    handleActionError('Could not fetch threads', err);
  }
};

/**
 * Fetches a thread by its _id from a database, populating it with related author and child thread information.
 *
 * @param {string} threadId thread._id, MongoDb ObjectId parameter of a thread.
 *
 * @returns a promise that resolves to the fetched thread object.
 */
export const fetchThreadById = async (threadId: string) => {
  try {
    connectToDB();

    return await ThreadModel.findById(threadId)
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
  } catch (err: any) {
    handleActionError('Could not fetch a thread', err);
  }
};

/**
 * Adds a comment to a thread by creating a new comment thread, linking it to the original thread,
 * and updating the original thread's children array.
 *
 * @param {string} params.threadId thread._id, MongoDb ObjectId parameter of a thread.
 * @param {string} params.commentText the text of the comment.
 * @param {string} params.userObjectId the author's _id MongoDb ObjectId.
 * @param {string} params.path the pathname to revalidate cached data.
 */
export const addCommentToThread = async ({
  threadId,
  commentText,
  userObjectId,
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
      author: userObjectId,
      parent: threadId, // Set the parent to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err: any) {
    handleActionError('Could not add a comment to the thread', err);
  }
};

/**
 * Adds user reaction on a thread by adding or removing userId to the 'thread.likes' property of the thread MongoDb object.
 *
 * @param {string} params.threadId thread._id, MongoDb ObjectId parameter of a thread.
 * @param {string} params.userId the author's _id MongoDb ObjectId.
 * @param {string} params.path the pathname to revalidate cached data.
 */
export const reactToThread = async ({
  threadId,
  userObjectId,
  path,
}: TReactToThreadParams): Promise<
  { error: { message: string } | null } | undefined
> => {
  try {
    connectToDB();

    // Find the original thread by its ObjectId
    const thread = await ThreadModel.findById(threadId);

    if (!thread) throw new Error('Thread not found');

    // Add / remove the user ID to the copy of thread's 'likes' list
    const updThreadLikes = thread.likes.slice();
    updThreadLikes.includes(userObjectId)
      ? updThreadLikes.splice(updThreadLikes.indexOf(userObjectId), 1)
      : updThreadLikes.push(userObjectId);

    // Save the updated original thread to the database
    thread.likes = updThreadLikes;
    await thread.save();

    revalidatePath(path);

    return { error: null };
  } catch (err: any) {
    handleActionError("Could not update a user's reaction to a thread", err);
  }
};
