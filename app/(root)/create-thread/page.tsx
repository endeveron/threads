import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

const Page = async () => {
  const authUser = await currentUser();
  if (!authUser) return null;

  // const authUserData = await fetchUser(authUser.id);
  // if (!authUserData?.onboarded) redirect('/onboarding');

  const user: TUser = await fetchUser(authUser.id);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');
  const userObjectIdStr = user._id.toString(); // Mongo ObjectId

  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-start">
      <h1 className="head-text">Create a New Thread</h1>

      <PostThread userObjectIdStr={userObjectIdStr} />
    </div>
  );
};

export default Page;
