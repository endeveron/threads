import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

// import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';

interface PageProps {}

const Page = async (props: PageProps) => {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect('/');

  const userData = {
    id: user.id,
    objectId: userInfo?.id,
    username: userInfo ? userInfo?.username : user.username ?? '',
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Threds.
      </p>

      <AccountProfile user={userData} btnTitle="Continue" />
    </div>
  );
};

export default Page;
