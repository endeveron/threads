import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
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
    <article className="community-card paper">
      <div className="flex flex-wrap items-center gap-5">
        <Link href={`/communities/${id}`} className="relative h-12 w-12">
          <Image
            src={image}
            alt="community_logo"
            fill
            className="rounded-full object-cover"
          />
        </Link>

        <div>
          <Link href={`/communities/${id}`}>
            <h4 className="text-base-semibold text-light-1">{name}</h4>
          </Link>
          <p className="text-small-medium text-light-3">@{username}</p>
        </div>
      </div>

      <p className="mt-5 text-subtle-medium text-light-3">{bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
        <Link href={`/communities/${id}`}>
          <Button size="sm" className="button">
            View
          </Button>
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
