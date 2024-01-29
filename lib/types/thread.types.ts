import { TItemData, TUserItemData } from '@/lib/types/common.types';
import { Date, ObjectId } from 'mongoose';

type TThreadParams = {
  _id: string | ObjectId;
  author: string;
  text: string;
  parent: string;
  children: string;
  community: string;
  createdAt: Date;
};

type TThreadActionBaseParams = {
  threadId: string;
  userObjectId: string;
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
  parent?: string;
};

export type TThreadPopulated = Omit<
  TThread,
  'author' | 'children' | 'community'
> & {
  author: TUserItemData;
  children: TThreadWithPopulatedAuthor[];
  community: TItemData | null;
};

export type TThreadWithPopulatedAuthor = Omit<TThread, 'author'> & {
  author: TUserItemData;
};

export type TCreateThreadParams = Pick<TThreadParams, 'author' | 'text'> & {
  communityId: string | null;
  path: string;
};

export type TFetchThreadsParams = {
  pageNumber?: number;
  pageSize?: number;
};

export type TFetchUserRepliesParams = TFetchThreadsParams & {
  replyIdList: ObjectId[];
};

export type TAddCommentToThreadParams = TThreadActionBaseParams & {
  commentText: string;
};

export type TReactToThreadParams = TThreadActionBaseParams & {};

export type TThreadCardProps = {
  id: string;
  userId: string | null;
  userObjectId: string | null;
  author: TUserItemData;
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  content: string;
  replies: TThreadWithPopulatedAuthor[];
  likes: ObjectId[];
  parent: string | null;
  createdAt: any;
  isReply?: boolean;
  path?: string;
  disableTextLink?: boolean;
};

export type TThreadReplyPopulated = {
  _id: ObjectId;
  likes: ObjectId[];
  text: string;
  author: TUserItemData;
  parent: {
    _id: ObjectId;
    author: TUserItemData;
    text: string;
  };
  community: TItemData | undefined;
  createdAt: any;
};

// export type TReplyCardProps = Omit<TThreadCardProps, 'community'> & {
export type TReplyCardProps = TThreadReplyPopulated & {
  userId: string;
  userObjectId: string;
};
