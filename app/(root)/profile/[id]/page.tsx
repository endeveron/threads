import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TProfileTabValue, TTab, profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import UserReplies from '@/components/shared/UserReplies';

type TPageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: TPageProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  if (!authUser) return null;
  const authUserId = authUser.id.toString();

  // Fetch user data from db
  const userId = params.id;
  const user = await fetchUser(userId);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');
  const userObjectId = user._id.toString();

  // Calculate the length of ('threads' | 'replies')
  const addTabHeaderCounter = (tab: TTab<TProfileTabValue>) => {
    if (tab.value === 'tagged') return null;
    const count = user[tab.value]?.length;
    return !!count && <p className="ml-1 font-semibold text-accent">{count}</p>;
  };

  return (
    <section className="page">
      <ProfileHeader
        userId={userId}
        authUserId={authUserId}
        authUserObjectId={userObjectId}
        name={user.name}
        username={user.username}
        imgUrl={user.image}
        bio={user.bio}
      />

      <div className="mt-14">
        <Tabs className="w-full" defaultValue="threads">
          <TabsList className="tabs-list">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className="tabs-trigger"
              >
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain flex-shrink-0"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {/* `tagged` value hasn't been calculated */}
                {addTabHeaderCounter(tab)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="tabs-content">
            <ThreadsTab
              userId={authUserId}
              userObjectId={userObjectId}
              id={user.id} // user ClerkId
              contentType="userThreads"
            />
          </TabsContent>

          <TabsContent value="replies" className="tabs-content">
            <UserReplies
              className="mt-9"
              userId={userId}
              userObjectId={userObjectId}
              replyIdList={user.replies}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
