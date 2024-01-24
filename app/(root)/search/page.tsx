import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

// import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import UserCard from '@/components/cards/UserCard';
import Searchbar from '@/components/shared/SearchBar';
import { TUser } from '@/lib/types/user.types';

interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

// Route '/search' allowed for unauthenicated users
const Page = async ({ searchParams }: PageProps) => {
  // Get user auth data from clerk
  const authUser = await currentUser();
  let user: TUser | undefined;
  let authUserId: string | null = null;
  let userObjectId: string | null = null;

  if (authUser) {
    // Fetch user data from db
    authUserId = authUser.id.toString();
    user = await fetchUser(authUserId);
    if (user) userObjectId = user._id.toString();
    if (!user?.onboarded) redirect('/onboarding');
  }

  const result = await fetchUsers({
    userId: authUserId, // Clerk user id
    searchQuery: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <>
      <Searchbar routeType="search" />

      <section className="mt-8 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
                type="user"
              />
            ))}
          </div>
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
