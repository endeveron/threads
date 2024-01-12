import { ObjectId } from 'mongoose';

type TThreadParams = {
  author: string;
  children: string;
  community: string;
  createdAt: string;
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
  userId: string;
  path: string;
};

export type TThreadCardProps = {
  author: {
    id: string;
    name: string;
    image: string;
  };
  comments: {
    author: {
      image: string;
    };
  }[];
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  content: string;
  createdAt: string;
  userId: string;
  id: string;
  parentId: string | null;
  isComment?: boolean;
};
