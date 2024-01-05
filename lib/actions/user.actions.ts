'use server';

import { revalidatePath } from 'next/cache';

import UserModel from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { TUpdateUserParams } from '@/lib/types/user.types';
import { getUserIdPropName } from '@/lib/utils/userId';

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

    // We can fetch user by MongoDB ObjectId or Clerk Id
    // '_id' prop for the MongoId, 'id' for the ClerkId
    const userIdPropName = getUserIdPropName(userId);
    if (!userIdPropName)
      throw new Error(`Failed to fetch user. Invalid userId: ${userId}`);

    return await UserModel.findOne().where(userIdPropName).equals(userId);
    // .populate({
    //   path: 'communities',
    //   model: CommunityModel,
    // });
  } catch (err: any) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
};
