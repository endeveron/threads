'use server';

import { revalidatePath } from 'next/cache';

import { connectToDB } from '@/lib/mongoose';
import { TCreateThreadParams } from '@/lib/types/thread.types';
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
