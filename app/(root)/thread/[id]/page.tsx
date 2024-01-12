import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import { fetchUser } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import Comment from '@/components/forms/Comment';
import { TUser } from '@/lib/types/user.types';

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

  const user: TUser = await fetchUser(authUser.id);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');
  const userId = authUser.id;
  const userObjectId = user._id;

  const thread = await fetchThreadById(params.id);

  return (
    <div className="relative">
      <ThreadCard
        id={thread._id}
        author={thread.author}
        content={thread.text}
        community={thread.community}
        replies={thread.children}
        likes={thread.likes}
        parentId={thread.parentId}
        createdAt={thread.createdAt}
        userId={userId} // Clerk user id
        userObjectId={userObjectId}
      />

      <div className="mt-10">
        <Comment
          threadId={params.id}
          userImg={user.image}
          userObjectIdStr={userObjectId?.toString()}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((reply: any) => (
          <ThreadCard
            id={reply._id}
            author={reply.author}
            content={reply.text}
            community={reply.community}
            replies={reply.children}
            likes={reply.likes}
            parentId={reply.parentId}
            createdAt={reply.createdAt}
            isReply
            userId={userId} // Clerk user id
            userObjectId={userObjectId}
            key={reply._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
