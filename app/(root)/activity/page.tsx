import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { fetchActivity, fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';
import ActivityCard from '@/components/cards/ActivityCard';

interface PageProps {}

const Page = async (props: PageProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;
  const authUserId = authUser.id.toString();

  // Fetch user data from db
  const user = await fetchUser(authUserId);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');

  // Fetch all replies on the user threads
  const activities = await fetchActivity(user?._id);

  return (
    <section className="page">
      <h1 className="head-text">Activity</h1>

      {activities?.length ? (
        <div className="flex flex-col gap-5">
          {activities.map((activity) => (
            <ActivityCard activity={activity} key={activity._id} />
          ))}
        </div>
      ) : (
        <p className="no-result">No activity yet</p>
      )}
    </section>
  );
};

export default Page;
