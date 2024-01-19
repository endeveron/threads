import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreads } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

// Route '/' allowed for unauthenicated users
const Home = async () => {
  const authUser = await currentUser();
  let user: TUser | undefined;

  if (authUser) {
    user = await fetchUser(authUser.id);
    if (user && !user.onboarded) redirect('/onboarding');
  }

  const { threads, isNext } = await fetchThreads({});

  return (
    <section className="main-thread-list">
      {threads?.length === 0 ? (
        <p className="no-result">No threads found</p>
      ) : (
        threads.map((thread) => (
          <ThreadCard
            id={thread._id}
            author={thread.author}
            content={thread.text}
            community={thread.community}
            replies={thread.children}
            likes={thread.likes}
            parentId={thread.parentId}
            createdAt={thread.createdAt}
            key={thread._id}
            userId={authUser?.id ?? null}
            userObjectId={user?._id ?? null}
          />
        ))
      )}
    </section>
  );
};

export default Home;
