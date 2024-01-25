'use client';

import { SignOutButton as ClerkSignOutButton, SignedIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SignOutButtonProps {
  callbackRoute?: string;
  label?: string;
}

const SignOutButton = ({ callbackRoute = '/', label }: SignOutButtonProps) => {
  const router = useRouter();

  return (
    <div className="sign-out-button">
      <SignedIn>
        <ClerkSignOutButton signOutCallback={() => router.push(callbackRoute)}>
          <div className="flex cursor-pointer gap-4 p-4">
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
            {!!label && <p className="text-secondary max-lg:hidden">{label}</p>}
          </div>
        </ClerkSignOutButton>
      </SignedIn>
    </div>
  );
};

export default SignOutButton;
