import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const fetchedUser = await fetchUser(user.id);
  if (!fetchedUser?.onboarded) redirect('/onboarding');
  const userId = fetchedUser._id.toString(); // Mongo ObjectId

  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-start">
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userId} />
    </div>
  );
};

export default Page;
