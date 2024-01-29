import { ObjectId } from 'mongoose';

import { TThread } from '@/lib/types/thread.types';
import { TUser } from '@/lib/types/user.types';

export type TCommunity = {
  _id: ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  createdBy: ObjectId;
  threads: TThread[];
  members: TUser[];
  requests: TUser[];
  bio?: string;
};

export type TCommunityDetailsItem = {
  id: string;
  image: string;
  name: string;
  username: string;
};

export type TCommunityDetailsRequestItem = TCommunityDetailsItem & {
  email: string;
};

export type TCommunityDetails = Omit<
  TCommunity,
  'createdBy' | 'members' | 'requests'
> & {
  createdBy: TUser;
  members: TCommunityDetailsItem[];
  requests: TCommunityDetailsRequestItem[];
};

export type TSuggestedCommunity = Pick<
  TCommunity,
  'id' | 'name' | 'username' | 'image' | 'members'
>;

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

export type TProfileHeaderCommunity = {
  id: string;
  creatorId: string;
  isJoinAllowed: boolean;
};

export type TRequestJoinCommunityParams = {
  communityId: string;
  userObjectId: string;
  path: string;
};

export type TAcceptJoinCommunityParams = {
  userId: string;
  communityId: string;
  path: string;
};
