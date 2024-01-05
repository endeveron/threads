import { redirect } from 'next/navigation';

// import { fetchCommunityPosts } from "@/lib/actions/community.actions";
// import { fetchUserPosts } from "@/lib/actions/user.actions";

import ThreadCard from '../cards/ThreadCard';

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

/**
 * @param authUserId ClerkId of the authenticated user / currentUserId
 * @param userId ClerkId of the current profile user / accountId
 * @param accountType 'User' | 'Community'
 */
const ThreadsTab = async ({
  authUserId,
  userId,
  accountType,
}: TThreadsTabProps) => {
  let content: TThreadsTabContent;

  // if (accountType === 'Community') {
  //   content = await fetchCommunityPosts(accountId);
  // } else {
  //   content = await fetchUserPosts(accountId);
  // }

  // if (!content) {
  //   redirect('/');
  // }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {/* {content.threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
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
      ))} */}
    </section>
  );
};

export default ThreadsTab;
