import { currentUser } from '@clerk/nextjs';

import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Page = async () => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;
  const authUserId = authUser.id.toString();

  // Fetch user data from db
  const user = await fetchUser(authUserId);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');

  const userObjectId = user._id.toString();

  return (
    <section className="page">
      <h1 className="head-text">Create a New Thread</h1>

      <PostThread userObjectId={userObjectId} />
    </section>
  );
};

export default Page;
