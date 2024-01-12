import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

// import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import UserCard from '@/components/cards/UserCard';
import Searchbar from '@/components/shared/SearchBar';

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

  const result = await fetchUsers({
    userId: authUser.id, // Clerk user id
    searchQuery: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text">Search</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                userId={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
                type="user"
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
