import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userData = await fetchUser(user.id);
  if (!userData?.onboarded) redirect('/onboarding');
  const userId = userData._id.toString();

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start">
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userId} />
    </main>
  );
};

export default Page;
