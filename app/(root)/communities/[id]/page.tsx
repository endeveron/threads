import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Image from 'next/image';

import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityTabs } from '@/constants';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import UserCard from '@/components/cards/UserCard';
import { TUser } from '@/lib/types/user.types';
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

  // Fetch user data from db
  const user = await fetchUser(authUser.id);
  if (!user) throw new Error('Error fetching user data.');

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.createdBy.id}
        authUserId={authUser.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="community"
      />

      <div className="mt-10">
        <Tabs className="w-full" defaultValue="threads">
          <TabsList className="tabs-list">
            {communityTabs.map((tab) => (
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
                    {communityDetails.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="tabs-content">
            <ThreadsTab
              accountType="community"
              id={communityDetails._id} // community ObjectId
              userId={authUser.id}
              userObjectId={user._id}
            />
          </TabsContent>

          <TabsContent value="members" className="tabs-content">
            <section className="mt-9 grid sm:grid-cols-2 gap-5">
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  userId={member.id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                  type="user"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="tabs-content">
            <ThreadsTab
              accountType="community"
              id={communityDetails._id}
              userId={authUser.id}
              userObjectId={user._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
