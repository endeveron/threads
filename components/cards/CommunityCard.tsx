import Image from 'next/image';
import Link from 'next/link';

import { TCommunityCardProps } from '@/lib/types/community.types';

function CommunityCard({
  id,
  name,
  username,
  image,
  bio,
  members,
}: TCommunityCardProps) {
  return (
    <article className="community-card card paper">
      <div className="flex flex-wrap items-center gap-5">
        <Link href={`/community/${id}`} className="relative h-12 w-12">
          <Image
            src={image}
            alt="community_logo"
            className="rounded-full object-cover"
            sizes="256px"
            fill
          />
        </Link>

        <div>
          <Link href={`/community/${id}`}>
            <h4 className="text-base-semibold text-main">{name}</h4>
          </Link>
          <p className="text-small-medium text-tertiary">@{username}</p>
        </div>
      </div>

      <p className="mt-5 text-subtle-medium text-secondary">{bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
        <Link href={`/community/${id}`} className="link-button--small">
          View
        </Link>

        {members.length > 0 && (
          <div className="flex items-center">
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={32}
                height={32}
                className={`${
                  index !== 0 && '-ml-3'
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CommunityCard;
