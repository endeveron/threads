'use client';

import { ObjectId } from 'mongoose';
import Image from 'next/image';
import { useState } from 'react';

type TLikeButtonProps = {
  likeList: ObjectId[];
  userObjectIdStr?: string;
};

const LikeButton = ({ userObjectIdStr, likeList = [] }: TLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!userObjectIdStr) return null;

  const handleClick = () => {
    setIsLiked((prev) => !prev);
  };

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
