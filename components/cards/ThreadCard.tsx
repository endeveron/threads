import Image from 'next/image';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';

import { TThreadCardProps } from '@/lib/types/thread.types';
import { cn } from '@/lib/utils/cn';
import { formatDateString } from '@/lib/utils/format';
import LikeButton from '@/components/shared/LikeButton';

const ThreadCard = ({
  id,
  author,
  community,
  content,
  replies,
  likes,
  parentId,
  isReply,
  createdAt,
  userObjectId,
  userId,
}: TThreadCardProps) => {
  return (
    <article
      className={cn('thread-card flex w-full flex-col rounded-xl', {
        'mt-2 px-0 xs:px-7': isReply,
        'bg-2 p-7': !isReply,
      })}
    >
      <div className="thread-card_content-wrapper flex  flex-col items-start justify-between">
        <div className="thread-card_content flex w-full flex-1 flex-row gap-4">
          <div className="thread-card_column flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                fill
                sizes=""
                className="cursor-pointer rounded-full"
                alt="user avatar"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="thread-card_column flex flex-col w-full">
            <Link
              className="thread-card_profile-link w-fit"
              href={`/profile/${author.id}`}
            >
              <h4 className="thread-card_author-name cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="thread-card_text-content mt-1 text-small-regular text-light-2">
              {content}
            </p>

            {/* Toolbar */}
            <div
              className={cn(
                'thread-card_toolbar mt-5 flex flex-wrap items-center gap-5',
                {
                  'mb-5': isReply,
                },
                {
                  'mb-4 ': !isReply && replies?.length,
                }
              )}
            >
              {/* Action buttons (icons) */}
              <SignedIn>
                <div className="thread-card_actions flex gap-5 mr-3">
                  <LikeButton
                    threadId={id.toString()}
                    userObjectIdStr={userObjectId?.toString()}
                    likes={likes}
                  />
                  <Link href={`/thread/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                      sizes=""
                    />
                  </Link>
                  <Image
                    src="/assets/share.svg"
                    alt="share"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                    sizes=""
                  />
                </div>
              </SignedIn>

              {/* Time / Date / Communities */}
              {!isReply && (
                <p className="flex items-center flex-wrap text-subtle-medium text-light-3">
                  <span className="flex items-center cursor-default mr-7">
                    {formatDateString(createdAt)}
                  </span>
                  {community && (
                    <Link
                      href={`/communities/${community.id}`}
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
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies?.length && replies.length > 0 ? (
          <Link href={`/thread/${id}`}>
            <div className="thread-card_replies flex items-center pl-1.5 mt-2">
              {replies.map((reply, index) => (
                <Image
                  key={index}
                  src={reply.author.image}
                  alt={`user_${index}`}
                  width={32}
                  height={32}
                  className={`${
                    index !== 0 && '-ml-3'
                  } rounded-full object-cover`}
                />
              ))}
              <p className="thread-card_replies-text relative text-subtle-medium text-light-3 ml-4">
                {replies.length} repl{replies.length > 1 ? 'ies' : 'y'}
              </p>
            </div>
          </Link>
        ) : null}

        {/* TODO: Delete thread */}
        {/* TODO: Show comment logos */}
      </div>
    </article>
  );
};

export default ThreadCard;
