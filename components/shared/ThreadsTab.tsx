import { ObjectId } from 'mongoose';
import { redirect } from 'next/navigation';

import { fetchCommunityThreads } from '@/lib/actions/community.actions';
import { fetchUserThreads } from '@/lib/actions/user.actions';
import ThreadCard from '../cards/ThreadCard';

import { TTabContentType } from '@/lib/types/common.types';
import { TThreadPopulated } from '@/lib/types/thread.types';
import { handleActionError } from '@/lib/utils/error';

type TThreadsTabContent = {
  _id: ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  threads: TThreadPopulated[];
};

type TThreadsTabProps = {
  id: string;
  userId: string;
  userObjectId: string;
  contentType: TTabContentType;
};

const ThreadsTab = async ({
  id, // user ClerkId or community ClerkId
  userId,
  userObjectId,
  contentType,
}: TThreadsTabProps) => {
  let content: TThreadsTabContent | undefined;

  try {
    switch (contentType) {
      case 'userThreads':
        content = await fetchUserThreads(id);
        break;
      case 'communityThreads':
        content = await fetchCommunityThreads(id);
    }
  } catch (err) {
    handleActionError('Error fetching data', err);
  }

  if (!content) redirect('/');

  return (
    content && (
      <section className="mt-9 flex flex-col gap-10">
        {content.threads.map((thread) => (
          <ThreadCard
            key={thread._id.toString()}
            id={thread._id.toString()}
            userId={userId}
            userObjectId={userObjectId}
            parent={thread.parent || null}
            content={thread.text}
            author={
              content && contentType === 'userThreads'
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
              content && contentType === 'communityThreads'
                ? { name: content.name, id: content.id, image: content.image }
                : thread.community
            }
            replies={thread.children}
            likes={thread.likes}
            createdAt={thread.createdAt}
          />
        ))}
      </section>
    )
  );
};

export default ThreadsTab;
