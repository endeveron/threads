import { redirect } from 'next/navigation';

// import { fetchCommunityPosts } from "@/lib/actions/community.actions";
// import { fetchUserThreads } from "@/lib/actions/user.actions";

import ThreadCard from '../cards/ThreadCard';
import { fetchUserThreads } from '@/lib/actions/user.actions';

type TThreadsTabContent = {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
};

type TThreadsTabProps = {
  authUserId: string;
  userId: string;
  accountType: string;
};

const ThreadsTab = async ({
  authUserId,
  userId,
  accountType,
}: TThreadsTabProps) => {
  // let content: TThreadsTabContent;

  // if (accountType === 'Community') {
  //   content = await fetchCommunityPosts(accountId);
  // } else {
  //   content = await fetchUserThreads(accountId);
  // }

  const content: TThreadsTabContent = await fetchUserThreads(userId);

  if (!content) {
    redirect('/');
  }

  console.log('content', content);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {content.threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          userId={userId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? { name: content.name, image: content.image, id: content.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === 'Community'
              ? { name: content.name, id: content.id, image: content.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
