import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import { fetchUser } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import Comment from '@/components/forms/Comment';

export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  if (!params.id) return null;

  const authUser = await currentUser();
  if (!authUser) return null;

  const user = await fetchUser(authUser.id);
  const userId = JSON.stringify(user._id); // MongoDb ObjectId

  const thread = await fetchThreadById(params.id);

  return (
    <div className="relative">
      <ThreadCard
        id={thread._id}
        userId={authUser.id}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
      />

      <div className="mt-10">
        <Comment threadId={params.id} userImg={user.image} userId={userId} />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            userId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
