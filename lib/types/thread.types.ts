import { ObjectId } from 'mongoose';

export type TThread = {
  _id: ObjectId;
  author: ObjectId;
  children: TThread[];
  createdAt: Date;
  likes: ObjectId[];
  text: string;
  community?: ObjectId;
  parentId?: string;
};

export type TThreadAuthor = {
  id: string;
  name: string;
  image: string;
};

type TThreadParams = {
  author: string;
  children: string;
  community: string;
  createdAt: Date;
  parentId: string;
  text: string;
  _id: string | ObjectId;
};

export type TCreateThreadParams = Pick<TThreadParams, 'author' | 'text'> & {
  communityId: string | null;
  path: string;
};

export type TFetchThreadsParams = {
  pageNumber?: number;
  pageSize?: number;
};

export type TAddCommentToThreadParams = {
  threadId: string;
  commentText: string;
  userObjectIdStr: string;
  path: string;
};

export type TThreadCardProps = {
  id: string;
  userId: string | null;
  userObjectId: ObjectId | null;
  author: TThreadAuthor;
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  content: string;
  replies: {
    author: {
      image: string;
    };
  }[];
  likes: ObjectId[];
  parentId: string | null;
  createdAt: string;
  isReply?: boolean;
};
