import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

interface PageProps {}

const Page = async (props: PageProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;

  // Fetch user data from db
  const user = await fetchUser(authUser.id);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');

  const userData = {
    id: authUser.id,
    username: user?.username || authUser.username || '',
    name: user?.name || authUser.firstName || '',
    bio: user?.bio || '',
    image: user?.image || authUser.imageUrl,
  };

  return (
    <>
      <h1 className="head-text">Edit User Profile</h1>

      <AccountProfile user={userData} btnTitle="Continue" />
    </>
  );
};

export default Page;
