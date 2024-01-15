import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

interface PageProps {}

const Page = async (props: PageProps) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const user: TUser = await fetchUser(authUser.id);
  if (!user?.onboarded) redirect('/onboarding');

  const userData = {
    id: authUser.id,
    username: user?.username || authUser.username || '',
    name: user?.name || authUser.firstName || '',
    bio: user?.bio || '',
    image: user?.image || authUser.imageUrl,
  };

  return (
    <>
      <h1 className="head-text">Edit profile</h1>
      {/* <p className="text-base-regular text-light-2">
        Complete your profile now, to use Threds.
      </p> */}

      <AccountProfile user={userData} btnTitle="Continue" />
    </>
  );
};

export default Page;
