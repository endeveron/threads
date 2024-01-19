import { currentUser } from '@clerk/nextjs';

import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Page = async () => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;

  // Fetch user data from db
  const user = await fetchUser(authUser.id);
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
