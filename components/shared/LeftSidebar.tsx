'use client';

import { SignOutButton, SignedIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import MainMenuLinks from '@/components/shared/MainMenuLinks';

interface LeftSidebarProps {}

const LeftSidebar = (props: LeftSidebarProps) => {
  const router = useRouter();

  return (
    <section className="custom-scrollbar left-sidebar">
      <div className="left-sidebar_container">
        <MainMenuLinks />
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
