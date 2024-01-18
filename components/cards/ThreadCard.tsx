import Image from 'next/image';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';

import { TThreadCardProps } from '@/lib/types/thread.types';
import { cn } from '@/lib/utils';
import { formatDateString } from '@/lib/utils';
import LikeButton from '@/components/shared/LikeButton';
import DeleteThread from '@/components/forms/DeleteThread';
import ClickableContent from '@/components/shared/ClickableContent';

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
  userId,
  userObjectId,
  navLink,
}: TThreadCardProps) => {
  return (
    <article
      className={cn('thread-card flex w-full flex-col rounded-xl', {
        // 'mt-2 px-0 xs:px-7': isReply,
        // 'paper p-7': !isReply,
        reply: isReply,
      })}
    >
      <div className="thread-card_content-wrapper flex flex-col items-start justify-between">
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

            {replies?.length ? <div className="thread-card_bar" /> : null}
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

            <ClickableContent id={id.toString()} navLink={navLink}>
              <p className="thread-card_text-content text-small-regular text-secondary leading-6">
                {content}
              </p>
            </ClickableContent>

            {/* Toolbar */}
            <div
              className={cn(
                'thread-card_toolbar mt-5 flex flex-wrap items-center gap-5',
                {
                  'mb-5': isReply,
                },
                {
                  'mb-3 ': !isReply && replies?.length,
                }
              )}
            >
              {/* Action buttons (icons) */}
              <SignedIn>
                <div className="thread-card_actions flex gap-7 mr-3">
                  <LikeButton
                    threadId={id.toString()}
                    userObjectIdStr={userObjectId?.toString()}
                    likes={likes}
                  />
                  {/* <Link href={`/thread/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={18}
                      height={18}
                      className="action-icon"
                      sizes=""
                    />
                  </Link> */}
                  <Image
                    src="/assets/share.svg"
                    alt="share"
                    width={18}
                    height={18}
                    className="action-icon"
                    sizes=""
                  />
                  <DeleteThread
                    id={id.toString()}
                    userId={userId}
                    authorId={author.id}
                    parentId={parentId}
                    isReply={isReply}
                  />
                </div>
              </SignedIn>

              {/* Time / Date / Communities */}
              {!isReply && (
                <p className="flex gap-x-7 gap-y-3 items-center flex-wrap text-subtle-medium text-tertiary">
                  <span className="flex items-center cursor-default">
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
              <p className="thread-card_replies-text relative text-subtle-medium text-tertiary ml-4">
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
