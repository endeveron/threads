import { cn } from '@/lib/utils/cn';
import { formatDateString } from '@/lib/utils/format';
import Image from 'next/image';
import Link from 'next/link';

interface ThreadCardProps {
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
}

const ThreadCard = ({
  author,
  comments,
  community,
  content,
  createdAt,
  userId, // Clerk user id
  id,
  parentId,
  isComment,
}: ThreadCardProps) => {
  console.log('community', community);

  return (
    <article
      className={cn('thread-card flex w-full flex-col rounded-xl', {
        'mt-2 px-0 xs:px-7': isComment,
        'bg-2 p-7': !isComment,
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
                  'mb-5': isComment,
                }
              )}
            >
              {/* Action buttons (icons) */}
              <div className="thread-card_actions flex gap-3.5 mr-3">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                  sizes=""
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
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                  sizes=""
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                  sizes=""
                />
              </div>

              {/* Time / Date / Communities */}
              {!isComment && (
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

              {/* Comments */}
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="thread-card_comments mt-1 text-subtle-medium text-light-2">
                    {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* TODO: Delete thread */}
        {/* TODO: Show comment logos */}
      </div>
    </article>
  );
};

export default ThreadCard;
