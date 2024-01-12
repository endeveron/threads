import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { fetchActivity, fetchUser } from '@/lib/actions/user.actions';

interface PageProps {}

const Page = async (props: PageProps) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const authUserData = await fetchUser(authUser.id);
  if (!authUserData?.onboarded) redirect('/onboarding');
  const userId = authUserData._id.toString(); // Mongo ObjectId

  // Fetch all replies on the user threads
  const replies = await fetchActivity(userId);

  return (
    <section>
      <h1 className="head-text">Activity</h1>

      <section className="flex flex-col gap-5">
        {replies.length > 0 ? (
          <>
            {replies.map((reply) => (
              <Link key={reply._id} href={`/thread/${reply.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={reply.author.image}
                    alt="user avatar"
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                  />
                  <p className="text-small-regular">
                    <span className="text-light-1 font-bold pl-1 pr-2">
                      {reply.author.name}
                    </span>
                    <span className="text-light-2">replied to your thread</span>
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="no-result">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
