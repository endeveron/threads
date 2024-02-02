'use client';

import { SignedIn } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/shared/Button';
import { TUserCardProps } from '@/lib/types/user.types';

// The card can handle either user data or community data
const UserCard = ({ id, name, username, image, type }: TUserCardProps) => {
  const router = useRouter();
  let navigatePath: string | null = null;

  switch (type) {
    case 'user':
      navigatePath = '/profile/';
      break;
    case 'community':
      navigatePath = '/community/';
  }

  return (
    <article className="user-card card">
      <div className="user-card_content">
        <div className="relative h-12 w-12">
          <Image
            src={image}
            alt="user avatar"
            className="rounded-full object-cover"
            sizes="256px"
            fill
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-main">{name}</h4>
          <p className="text-small-medium text-tertiary">@{username}</p>
        </div>
      </div>

      <SignedIn>
        <Button size="sm" onClick={() => router.push(navigatePath + id)}>
          View
        </Button>
      </SignedIn>
    </article>
  );
};

export default UserCard;
