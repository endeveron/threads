'use client';

import Button from '@/components/shared/Button';
import { reactToThread } from '@/lib/actions/thread.actions';
import { cn } from '@/lib/utils';
import { useErrorHandler } from '@/lib/utils/hooks';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type TLikeButtonProps = {
  threadId: string;
  likes: string[];
  userObjectId?: string;
};

const LikeButton = ({ threadId, userObjectId, likes }: TLikeButtonProps) => {
  const { toastError } = useErrorHandler();

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
      toastError(err);
    }
  };

  useEffect(() => {
    setIsLiked(likes.includes(userObjectId ?? ''));
  }, [likes]);

  return (
    <Button
      variant="outline"
      className="like-button action"
      onClick={handleClick}
    >
      <Image
        src={`/assets/heart${isLiked ? '-filled' : ''}.svg`}
        alt="heart"
        width={18}
        height={18}
        className={cn('action-icon', {
          stable: isLiked,
        })}
      />
    </Button>
  );
};

export default LikeButton;
