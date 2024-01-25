import { ObjectId } from 'mongoose';
import { redirect } from 'next/navigation';

import ThreadCard from '../cards/ThreadCard';
import { fetchUserThreads } from '@/lib/actions/user.actions';
import { fetchCommunityThreads } from '@/lib/actions/community.actions';
import { TAccountType } from '@/lib/types/account.types';
import { TThreadPopulated } from '@/lib/types/thread.types';

type TThreadsTabContent = {
  name: string;
  image: string;
  username: string;
  id: string;
  _id: ObjectId;
  threads: TThreadPopulated[];
};

type TThreadsTabProps = {
  id: string;
  userId: string;
  userObjectId: string;
  accountType: TAccountType;
};

const ThreadsTab = async ({
  id, // user ClerkId or community ClerkId
  userId,
  userObjectId,
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
          key={thread._id.toString()}
          id={thread._id.toString()}
          userId={userId}
          userObjectId={userObjectId}
          parentId={thread.parentId || null}
          content={thread.text}
          author={
            accountType === 'user'
              ? {
                  _id: content._id,
                  id: content.id,
                  name: content.name,
                  username: content.username,
                  image: content.image,
                }
              : {
                  _id: thread.author._id,
                  id: thread.author.id,
                  name: thread.author.name,
                  username: thread.author.username,
                  image: thread.author.image,
                }
          }
          community={
            accountType === 'community'
              ? { name: content.name, id: content.id, image: content.image }
              : thread.community
          }
          replies={thread.children}
          likes={thread.likes}
          createdAt={thread.createdAt}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
