import Image from 'next/image';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';

import { TReplyCardProps } from '@/lib/types/thread.types';
import { cn } from '@/lib/utils';
import { formatDateString } from '@/lib/utils';
import LikeButton from '@/components/shared/LikeButton';
import DeleteThread from '@/components/forms/DeleteThread';

const ReplyCard = ({
  _id,
  author,
  community,
  text,
  likes,
  parent,
  createdAt,
  userId,
  userObjectId,
}: TReplyCardProps) => {
  // const likeIdArray = likes?.length
  //   ? [...likes].map((userId) => userId.toString())
  //   : [];

  return (
    <article className="reply-card card rounded-lg">
      <div className="reply-card_parent flex flex-row gap-4 mb-2">
        <div className="thread-card_column flex flex-col items-center">
          <Link
            href={`/profile/${parent.author.id}`}
            className="relative h-11 w-11"
          >
            <Image
              src={parent.author.image}
              className="cursor-pointer rounded-full object-cover"
              alt="user avatar"
              sizes="256px"
              fill
            />
          </Link>
          <div className="thread-card_bar" />
        </div>

        <div className="thread-card_column flex flex-col w-full pb-4 ">
          <Link
            className="thread-card_profile-link w-fit"
            href={`/profile/${parent.author.id}`}
          >
            <h4 className="thread-card_author-name my-2.5 cursor-pointer text-base-semibold text-heading-2">
              {parent.author.name}
            </h4>
          </Link>

          <Link href={`/thread/${parent._id}`}>
            <p className="thread-card_text-content text-small-regular text-secondary leading-6">
              {parent.text}
            </p>
          </Link>
        </div>
      </div>

      <div className="reply-card_reply flex flex-row gap-4">
        <div className="thread-card_column flex flex-col items-center">
          <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
            <Image
              src={author.image}
              className="cursor-pointer rounded-full object-cover"
              alt="user avatar"
              sizes="256px"
              fill
            />
          </Link>
        </div>

        <div className="thread-card_column flex flex-col w-full">
          <Link
            className="thread-card_profile-link w-fit"
            href={`/profile/${author.id}`}
          >
            <h4 className="thread-card_author-name my-2.5 cursor-pointer text-base-semibold text-heading-2">
              {author.name}
            </h4>
          </Link>

          <Link href={`/thread/${_id}`}>
            <p className="thread-card_text-content text-small-regular text-secondary leading-6">
              {text}
            </p>
          </Link>

          {/* Toolbar */}
          <div className="thread-card_toolbar mt-5 flex flex-wrap items-center gap-5 mb-3">
            {/* Action buttons (icons) */}
            <SignedIn>
              <div className="thread-card_actions flex gap-7 mr-3">
                <LikeButton
                  threadId={_id.toString()}
                  userObjectId={userObjectId || ''}
                  likes={
                    likes?.length
                      ? [...likes].map((userId) => userId.toString())
                      : []
                  }
                />
                <Link href={`/thread/${_id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={18}
                    height={18}
                    className="action-icon"
                  />
                </Link>
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={18}
                  height={18}
                  className="action-icon"
                />
                <DeleteThread
                  id={_id.toString()}
                  userId={userId}
                  authorId={author.id.toString()}
                  parent={parent._id.toString()}
                  isReply={false}
                />
              </div>
            </SignedIn>

            {/* Time / Date / Communities */}
            <p className="flex gap-x-7 gap-y-3 items-center flex-wrap text-subtle-medium text-tertiary">
              <span className="flex items-center cursor-default">
                {formatDateString(createdAt)}
              </span>
              {community && (
                <Link
                  href={`/community/${community.id}`}
                  className="flex items-center"
                >
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={14}
                    height={14}
                    className="mr-2 rounded-full object-cover"
                  />
                  <span className="thread-card_community">
                    {community.name} Community
                  </span>
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReplyCard;
