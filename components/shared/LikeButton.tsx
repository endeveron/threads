'use client';

import { reactToThread } from '@/lib/actions/thread.actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type TLikeButtonProps = {
  threadId: string;
  likes: string[];
  userObjectId?: string;
};

const LikeButton = ({ threadId, userObjectId, likes }: TLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(likes.includes(userObjectId ?? ''));

  const pathname = usePathname();

  if (!userObjectId) return null;

  const toggleStatus = () => {
    setIsLiked((prev) => !prev);
  };

  const handleClick = async () => {
    toggleStatus();
    updateUserReaction();
  };

  // Send request to
  const updateUserReaction = async () => {
    try {
      // 'use server';
      const result = await reactToThread({
        threadId,
        userObjectId,
        path: pathname,
      });

      if (result?.error?.message) {
        throw new Error(
          `Error updating user reaction. ${result.error.message}`
        );
      }
    } catch (err) {
      // TODO: Handle Error
      console.error(err);
      throw new Error('Error updating user reaction.');
    }
  };

  useEffect(() => {
    setIsLiked(likes.includes(userObjectId ?? ''));
  }, [likes]);

  return (
    <div className="like-button" onClick={handleClick}>
      <Image
        src={`/assets/heart${isLiked ? '-filled' : ''}.svg`}
        alt="heart"
        width={18}
        height={18}
        className={cn('action-icon', {
          stable: isLiked,
        })}
        sizes=""
      />
    </div>
  );
};

export default LikeButton;
