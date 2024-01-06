'use server';

import { revalidatePath } from 'next/cache';

import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { TUpdateUserParams } from '@/lib/types/user.types';
import ThreadModel from '@/lib/models/thread.model';

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
