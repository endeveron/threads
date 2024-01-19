import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { fetchActivity, fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

interface PageProps {}

const Page = async (props: PageProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;

  // Fetch user data from db
  const user = await fetchUser(authUser.id);
  if (user && !user.onboarded) redirect('/onboarding');

  // Fetch all replies on the user threads
  const replies = await fetchActivity(user?._id);

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="flex flex-col gap-5">
        {replies.length > 0 ? (
          <>
            {replies.map((reply) => (
              <Link key={reply._id} href={`/thread/${reply.parentId}`}>
                <article className="activity-card paper">
                  <Image
                    src={reply.author.image}
                    alt="user avatar"
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                  />
                  <p className="text-small-regular">
                    <span className="text-main font-bold pl-1 pr-2">
                      {reply.author.name}
                    </span>
                    <span className="text-secondary">
                      replied to your thread
                    </span>
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="no-result">No activity yet</p>
        )}
      </section>
    </>
  );
};

export default Page;
