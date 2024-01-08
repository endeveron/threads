import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';

const Page = async () => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const authUserData = await fetchUser(authUser.id);
  if (!authUserData?.onboarded) redirect('/onboarding');
  const userId = authUserData._id.toString(); // Mongo ObjectId

  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-start">
      <h1 className="head-text">Create a New Thread</h1>

      <PostThread userId={userId} />
    </div>
  );
};

export default Page;
