import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';

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

  return (
    <section>
      <ProfileHeader
        userId={userId}
        authUserId={authUserId}
        authUserObjectId={userObjectId}
        name={user.name}
        username={user.username}
        imgUrl={user.image}
        bio={user.bio}
      />

      <div className="mt-10 mb-6">
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
                  sizes=""
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === 'Threads' && (
                  <p className="ml-1 font-semibold text-accent">
                    {user.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="tabs-content">
            <ThreadsTab
              userId={authUserId}
              userObjectId={userObjectId}
              id={user.id} // user ClerkId
              accountType="user"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
