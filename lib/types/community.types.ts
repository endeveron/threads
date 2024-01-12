import { TThread } from '@/lib/types/thread.types';
import { TUser } from '@/lib/types/user.types';
import { ObjectId } from 'mongoose';

export type TCommunity = {
  _id: ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  createdBy: ObjectId;
  threads: TThread[];
  members: TUser[];
  bio?: string;
};

export type TCreateCommunityParams = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  createdById: string;
};

export type TUpdateCommunityParams = {
  id: string;
  name: string;
  username: string;
  image: string;
};

export type TCommunityCardProps = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  members: {
    image: string;
  }[];
};
