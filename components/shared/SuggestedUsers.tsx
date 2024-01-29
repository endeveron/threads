import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import { fetchSuggestedUsers } from '@/lib/actions/user.actions';

type TSuggestedUsersProps = {};

const SuggestedUsers = async (props: TSuggestedUsersProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  const authUserId = authUser?.id?.toString();

  const users = await fetchSuggestedUsers({ authUserId });

  return (
    users?.length && (
      <div className="suggested-users flex flex-col gap-6">
        {users.map((user) => (
          <div className="user-item" key={user.id}>
            <Link href={`/profile/${user.id}`}>
              <Image
                src={user.image}
                alt="user avatar"
                height={48}
                width={48}
                className="rounded-full object-cover"
              />

              <div>
                <p className="text-small-medium text-main">{user.name}</p>
                <p className="text-small-medium text-tertiary">
                  @{user.username}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  );
};

export default SuggestedUsers;
