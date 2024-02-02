import Image from 'next/image';
import Link from 'next/link';

import JoinCommunity from '@/components/shared/JoinCommunity';
import { TProfileHeaderCommunity } from '@/lib/types/community.types';
import Test from '@/components/shared/Test';

interface ProfileHeaderProps {
  authUserId: string;
  authUserObjectId: string;
  name: string;
  username: string;
  imgUrl: string;
  communityId?: string;
  bio?: string;
  userId?: string;
  community?: TProfileHeaderCommunity;
}

const ProfileHeader = ({
  authUserId,
  authUserObjectId,
  name,
  username,
  imgUrl,
  bio,
  userId, // for profile
  community, // for community
}: ProfileHeaderProps) => {
  return (
    <div className="profile-header flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="user avatar"
              className="rounded-full object-cover"
              sizes="256px"
              fill
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-heading-2">
              {name}
            </h2>
            <p className="mt-05 text-base-medium text-tertiary">@{username}</p>
          </div>
        </div>

        {/* Only account owner can edit */}
        {userId === authUserId && (
          <Link href="/profile/edit">
            <div className="paper flex cursor-pointer gap-3 rounded-lg px-4 py-2">
              <Image
                src="/assets/edit.svg"
                alt="logout"
                width={16}
                height={16}
              />

              <p className="text-small-medium text-secondary max-sm:hidden">
                Edit
              </p>
            </div>
          </Link>
        )}

        {community && community.isJoinAllowed && (
          <JoinCommunity
            communityId={community.id}
            userObjectId={authUserObjectId}
          />
        )}
      </div>

      {bio && (
        <p className="mt-6 sm:mt-2 sm:ml-24 text-small-medium leading-6 text-secondary">
          {bio}
        </p>
      )}
    </div>
  );
};

export default ProfileHeader;
