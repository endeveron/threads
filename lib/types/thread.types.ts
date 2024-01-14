import { ObjectId } from 'mongoose';

type TThreadParams = {
  _id: string | ObjectId;
  author: string;
  text: string;
  parentId: string;
  children: string;
  community: string;
  createdAt: Date;
};

type TThreadActionBaseParams = {
  threadId: string;
  userObjectIdStr: string;
  path: string;
};

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

export type TCreateThreadParams = Pick<TThreadParams, 'author' | 'text'> & {
  communityId: string | null;
  path: string;
};

export type TFetchThreadsParams = {
  pageNumber?: number;
  pageSize?: number;
};

export type TAddCommentToThreadParams = TThreadActionBaseParams & {
  commentText: string;
};

export type TReactToThreadParams = TThreadActionBaseParams & {};

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
  likes: string[];
  parentId: string | null;
  createdAt: string;
  isReply?: boolean;
};
