'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TUserCardProps } from '@/lib/types/user.types';
import { Button } from '../ui/button';

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
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className="button px-7"
        onClick={() => router.push(navigatePath + userId)}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
