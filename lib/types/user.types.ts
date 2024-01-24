import { EmailAddress } from '@clerk/nextjs/server';
import { ObjectId, SortOrder } from 'mongoose';

export type TUser = {
  _id: ObjectId;
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  threads: [];
  onboarded: boolean;
  communities: [];
  bio?: string;
};

export type TFetchUsersParams = {
  userId: string | null;
  searchQuery?: string;
  sortBy?: SortOrder;
  pageNumber?: number;
  pageSize?: number;
};

export type TUpdateUserParams = {
  bio: string;
  email: string;
  image: string;
  name: string;
  path: string;
  userId: string;
  username: string;
};

export type TUserCardType = 'community' | 'request' | 'user';

export type TCommunityRequestData = {
  communityId: string;
};

export type TUserCardProps = {
  id: string; // userId or communityId
  name: string;
  username: string;
  image: string;
  type: TUserCardType;
  communityRequestData?: TCommunityRequestData;
};

export type TUserAuthData = {
  email: EmailAddress;
};
