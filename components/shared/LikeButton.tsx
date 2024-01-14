'use client';

import { reactToThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type TLikeButtonProps = {
  threadId: string;
  likes: string[];
  userObjectIdStr?: string;
};

const LikeButton = ({ threadId, userObjectIdStr, likes }: TLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(likes.includes(userObjectIdStr ?? ''));

  const pathname = usePathname();

  if (!userObjectIdStr) return null;

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
        userObjectIdStr,
        path: pathname,
      });

      if (result?.error?.message) {
        throw new Error(
          `Error updating user reaction. ${result.error.message}`
        );
      }
    } catch (err) {
      console.error(err);
      throw new Error('Error updating user reaction.');
    }
  };

  useEffect(() => {
    setIsLiked(likes.includes(userObjectIdStr ?? ''));
  }, [likes]);

  return (
    <div className="like-button" onClick={handleClick}>
      <Image
        src={`/assets/heart-${isLiked ? 'filled' : 'gray'}.svg`}
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
        sizes=""
      />
    </div>
  );
};

export default LikeButton;
