import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';

interface PageProps {}

const Page = async (props: PageProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;

  // Fetch user data from db
  const user = await fetchUser(authUser.id);
  if (user?.onboarded) redirect('/');

  const userData = {
    id: authUser.id,
    username: user?.username || authUser.username || '',
    name: user?.name || authUser.firstName || '',
    bio: user?.bio || '',
    image: user?.image || authUser.imageUrl,
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col justify-start p-4">
      <h1 className="head-text">Onboarding</h1>
      <p className="text-base-regular text-secondary">
        Complete your profile now, to use Threds.
      </p>

      <AccountProfile user={userData} btnTitle="Continue" />
    </div>
  );
};

export default Page;
