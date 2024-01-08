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

  const authUserData = await fetchUser(authUser.id);
  if (!authUserData?.onboarded) redirect('/onboarding');
  // const userId = JSON.stringify(authUserData._id); // MongoDb ObjectId
  const userId = authUserData._id.toString(); // MongoDb ObjectId

  const thread = await fetchThreadById(params.id);

  return (
    <div className="relative">
      <ThreadCard
        id={thread._id}
        userId={authUser.id} // Clerk user id
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
      />

      <div className="mt-10">
        <Comment
          threadId={params.id}
          userImg={authUserData.image}
          userId={userId}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            userId={authUser.id} // Clerk user id
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
