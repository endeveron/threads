import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

interface ThreadCardProps {
  author: {
    _id: string;
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
  currentUserId: string;
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
  currentUserId,
  id,
  parentId,
  isComment,
}: ThreadCardProps) => {
  return (
    <article
      className={cn('thread-card flex w-full flex-col rounded-xl', {
        'mt-2 px-0 xs:px-7': isComment,
        'bg-dark-2 p-7': !isComment,
      })}
    >
      <div className="thread-card_content-wrapper flex items-start justify-between">
        <div className="thread-card_content flex w-full flex-1 flex-row gap-4">
          <div className="thread-card_column flex flex-col items-center">
            <Link
              href={`/profile/${author._id}`}
              className="relative h-11 w-11"
            >
              <Image
                src={author.image}
                fill
                sizes=""
                className="cursor-pointer rounded-full"
                alt="Profile image"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="thread-card_column flex flex-col w-full">
            <Link
              className="thread-card_profile-link w-fit"
              href={`/profile/${author._id}`}
            >
              <h4 className="thread-card_author-name cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="thread-card_text-content mt-1 text-small-regular text-light-2">
              {content}
            </p>

            <div
              className={cn('thread-card_toolbar mt-5 flex flex-col gap-3', {
                'mb-5': isComment,
              })}
            >
              <div className="thread-card_actions flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="thread-card_comments mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
