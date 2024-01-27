import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import RequestCard from '@/components/cards/RequestCard';
import UserCard from '@/components/cards/UserCard';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TCommunityTabValue, TTab, communityTabs } from '@/constants';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import {
  TCommunityDetailsItem,
  TCommunityDetailsRequestItem,
} from '@/lib/types/community.types';

export type TCommunityRequestData = {
  communityId: string;
} | null;

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
  const user = await fetchUser(authUser.id);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');
  const userObjectId = user._id.toString();

  // Get community data
  const communityId = params.id;
  const communityDetails = await fetchCommunityDetails(communityId);

  // Create the member array by merging members and requestors
  const createMemberIdArray = () => {
    const memberIdArr = [...communityDetails.members].reduce(
      (acc: string[], item: TCommunityDetailsItem) => {
        acc.push(item.id);
        return acc;
      },
      []
    );
    const requestorIdArr = [...communityDetails.requests].reduce(
      (acc: string[], item: TCommunityDetailsRequestItem) => {
        acc.push(item.id);
        return acc;
      },
      []
    );

    return [...memberIdArr, ...requestorIdArr];
  };
  const memberIdArray = createMemberIdArray();

  // Configure data for RequestCard component to handle user requests to join the community
  const communityAdminId = communityDetails.createdBy.id;
  const isCommunityCreator =
    !!communityAdminId && communityAdminId === authUserId;

  // Configure data for ProfileHeader component
  const communityData = {
    id: communityId,
    creatorId: communityDetails.createdBy.id,
    isJoinAllowed: !memberIdArray.includes(authUserId),
  };

  // Calculate the length of ('threads' | 'members' | 'requests')
  const addTabHeaderCounter = (tab: TTab<TCommunityTabValue>) => {
    const count = communityDetails[tab.value]?.length;
    return !!count && <p className="ml-1 font-semibold text-accent">{count}</p>;
  };

  return (
    <section>
      <ProfileHeader
        authUserId={authUserId}
        authUserObjectId={userObjectId}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        community={communityData}
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
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {addTabHeaderCounter(tab)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="tabs-content">
            <ThreadsTab
              contentType="communityThreads"
              id={communityDetails._id.toString()} // community ObjectId
              userId={authUserId}
              userObjectId={userObjectId}
            />
          </TabsContent>

          <TabsContent value="members" className="tabs-content">
            <section className="mt-9 grid sm:grid-cols-2 gap-5">
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                  type="user"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="tabs-content">
            <section className="mt-9 grid sm:grid-cols-2 gap-5">
              {communityDetails.requests.map(
                (request: TCommunityDetailsRequestItem) => (
                  <RequestCard
                    key={request.id}
                    userId={request.id}
                    authUserId={authUserId}
                    name={request.name}
                    username={request.username}
                    image={request.image}
                    email={request.email}
                    communityId={communityId}
                    isCommunityCreator={isCommunityCreator}
                  />
                )
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
