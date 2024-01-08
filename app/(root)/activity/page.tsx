import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

// import Searchbar from "@/components/shared/Searchbar";
// import Pagination from "@/components/shared/Pagination";

import {
  fetchActivity,
  fetchUser,
  fetchUserReplies,
  fetchUsers,
} from '@/lib/actions/user.actions';
import UserCard from '@/components/cards/UserCard';

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

      <section className="mt-10 flex flex-col gap-5">
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
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
