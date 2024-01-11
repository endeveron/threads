import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';

import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityTabs } from '@/constants';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';

type TPageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: TPageProps) => {
  // Authenticated user
  const authUser = await currentUser();
  if (!authUser) return null;

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
          <TabsList className="tab">
            {communityTabs.map((tab) => (
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
                    {communityDetails.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="tabs_content">
            <ThreadsTab
              authUserId={authUser.id}
              id={communityDetails._id} // community ObjectId
              accountType="community"
            />
          </TabsContent>

          <TabsContent value="members" className="tabs_content">
            {/* <section className="mt-9 flex flex-col gap-10">
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
            </section> */}
          </TabsContent>

          <TabsContent value="requests" className="tabs_content">
            {/* <ThreadsTab
              authUserId={authUser.id}
              userId={communityDetails._id}
              accountType="Community"
            /> */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;