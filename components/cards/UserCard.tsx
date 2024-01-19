'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TUserCardProps } from '@/lib/types/user.types';
import Button from '@/components/shared/Button';
import { SignedIn } from '@clerk/nextjs';

const UserCard = ({ userId, name, username, image, type }: TUserCardProps) => {
  const router = useRouter();
  let navigatePath: string;

  switch (type) {
    case 'user':
      navigatePath = '/profile/';
      break;
    case 'community':
      navigatePath = '/communities/';
  }

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <Image
            src={image}
            alt="user avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-main">{name}</h4>
          <p className="text-small-medium text-tertiary">@{username}</p>
        </div>
      </div>

      <SignedIn>
        <Button size="sm" onClick={() => router.push(navigatePath + userId)}>
          View
        </Button>
      </SignedIn>
    </article>
  );
};

export default UserCard;
