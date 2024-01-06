import { currentUser } from '@clerk/nextjs';

import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';

type TPageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: TPageProps) => {
  // Authenticated user
  const authUser = await currentUser();
  if (!authUser) return null;

  // The user whose profile we receive
  const fetchedUser = await fetchUser(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={fetchedUser.id}
        authUserId={authUser.id}
        name={fetchedUser.name}
        username={fetchedUser.username}
        imgUrl={fetchedUser.image}
        bio={fetchedUser.bio}
      />

      <div className="mt-10">
        <Tabs className="w-full" defaultValue="threads">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
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
                  <p className="ml-1 font-semibold text-primary-500">
                    {fetchedUser.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                authUserId={authUser.id}
                userId={fetchedUser.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
