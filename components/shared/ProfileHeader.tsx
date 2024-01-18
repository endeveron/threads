import Link from 'next/link';
import Image from 'next/image';

interface ProfileHeaderProps {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio?: string;
  type?: 'user' | 'community';
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: ProfileHeaderProps) => {
  return (
    <div className="profile-header flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="user avatar"
              fill
              className="rounded-full object-cover shadow-2xl"
              sizes=""
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-heading-2">
              {name}
            </h2>
            <p className="mt-05 text-base-medium text-tertiary">@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== 'community' && (
          <Link href="/profile/edit">
            <div className="paper flex cursor-pointer gap-3 rounded-lg px-4 py-2">
              <Image
                src="/assets/edit.svg"
                alt="logout"
                width={16}
                height={16}
                sizes=""
              />

              <p className="text-small-medium text-secondary max-sm:hidden">
                Edit
              </p>
            </div>
          </Link>
        )}
      </div>

      {bio ? (
        <p className="mt-6 sm:mt-2 sm:ml-24 text-small-medium leading-6 text-secondary">
          {bio}
        </p>
      ) : null}

      <div className="mt-10 border-b border-b-border" />
    </div>
  );
};

export default ProfileHeader;
