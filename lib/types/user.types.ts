import { SortOrder } from 'mongoose';

export type TFetchUsersParams = {
  userId: string;
  searchQuery?: string;
  sortBy?: SortOrder;
  pageNumber?: number;
  pageSize?: number;
};

export type TUpdateUserParams = {
  bio: string;
  image: string;
  name: string;
  path: string;
  userId: string;
  username: string;
};
