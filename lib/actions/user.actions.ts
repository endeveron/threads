'use server';

import UserModel from '@/lib/models/user.model';
import { ConnectToDB } from '@/lib/mongoose';
import { TUserData } from '@/lib/types/user.types';
import { revalidatePath } from 'next/cache';

export async function updateUser({
  bio,
  image,
  name,
  path,
  userId,
  username,
}: TUserData): Promise<void> {
  ConnectToDB();

  try {
    await UserModel.findOneAndUpdate(
      { id: userId },
      {
        bio,
        image,
        name,
        onboarding: true,
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
}
