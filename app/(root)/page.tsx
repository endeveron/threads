import { currentUser } from '@clerk/nextjs';

import { fetchThreads } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/ThreadCard';

const Home = async () => {
  const { threads, isNext } = await fetchThreads({});

  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="flex flex-col gap-10 text-light-2">
        {threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          threads.map((thread) => (
            <ThreadCard
              author={thread.author}
              comments={thread.comments}
              community={thread.community}
              content={thread.text}
              createdAt={thread.createdAt}
              userId={user?.id || ''}
              id={thread._id}
              key={thread._id}
              parentId={thread.parentId}
            />
          ))
        )}
      </section>
    </>
  );
};

export default Home;
