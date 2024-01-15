import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import CommunityCard from '@/components/cards/CommunityCard';
import Searchbar from '@/components/shared/SearchBar';
import { fetchCommunities } from '@/lib/actions/community.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { TUser } from '@/lib/types/user.types';

interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const user: TUser = await fetchUser(authUser.id);
  if (!user) throw new Error('Error fetching user data.');
  if (!user.onboarded) redirect('/onboarding');

  const result = await fetchCommunities({
    searchQuery: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <>
      <h1 className="head-text">Communities</h1>

      <Searchbar routeType="communities" />

      <section className="mt-10 grid gap-7 sm:grid-cols-2">
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
      </section>

      {/* <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </>
  );
};

export default Page;
