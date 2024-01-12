import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

// import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import UserCard from '@/components/cards/UserCard';
import Searchbar from '@/components/shared/SearchBar';
import { fetchCommunities } from '@/lib/actions/community.actions';
import CommunityCard from '@/components/cards/CommunityCard';

interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const authUserData = await fetchUser(authUser.id);
  if (!authUserData?.onboarded) redirect('/onboarding');
  // const userId = authUserData._id.toString(); // Mongo ObjectId

  const result = await fetchCommunities({
    searchQuery: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  console.log('result', result);

  return (
    <section>
      <h1 className="head-text">Communities</h1>

      <Searchbar routeType="communities" />

      <div className="mt-10 grid gap-7 sm:grid-cols-2">
        {result.communities.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                image={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>

      {/* <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </section>
  );
};

export default Page;
