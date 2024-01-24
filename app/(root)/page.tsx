import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreads } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

// Route '/' allowed for unauthenicated users
const Home = async () => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  let user: TUser | undefined;
  let authUserId: string | null = null;
  let userObjectId: string | null = null;

  if (authUser) {
    // Fetch user data from db
    authUserId = authUser.id.toString();
    user = await fetchUser(authUserId);
    if (user) userObjectId = user._id.toString();
    if (!user?.onboarded) redirect('/onboarding');
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
            userId={authUserId}
            userObjectId={userObjectId}
          />
        ))
      )}
    </section>
  );
};

export default Home;
