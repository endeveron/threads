import { redirect } from 'next/navigation';

// import { fetchCommunityThreads } from "@/lib/actions/community.actions";
// import { fetchUserThreads } from "@/lib/actions/user.actions";

import ThreadCard from '../cards/ThreadCard';
import { fetchUserThreads } from '@/lib/actions/user.actions';
import { fetchCommunityThreads } from '@/lib/actions/community.actions';
import { TAccountType } from '@/lib/types/account';

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
  id: string;
  accountType: TAccountType;
};

const ThreadsTab = async ({
  authUserId,
  id, // user ObjectId or community ObjectId
  accountType,
}: TThreadsTabProps) => {
  let content: TThreadsTabContent;

  switch (accountType) {
    case 'user':
      content = await fetchUserThreads(id);
      break;
    case 'community':
      content = await fetchCommunityThreads(id);
  }

  if (!content) redirect('/');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {content.threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          userId={authUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'user'
              ? { name: content.name, image: content.image, id: content.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === 'community'
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
