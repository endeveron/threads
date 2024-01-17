import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';

import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { TUser } from '@/lib/types/user.types';

type TPageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: TPageProps) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const user: TUser = await fetchUser(params.id);
  if (!user) throw new Error('Error fetching user data.');

  return (
    <section>
      <ProfileHeader
        accountId={user.id}
        authUserId={authUser.id}
        name={user.name}
        username={user.username}
        imgUrl={user.image}
        bio={user.bio}
      />

      <div className="mt-10">
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
              userId={authUser.id}
              userObjectId={user._id}
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
