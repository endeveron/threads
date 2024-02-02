'use client';

import { SignOutButton as ClerkSignOutButton, SignedIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  callbackRoute?: string;
  label?: string;
  className?: string;
}

const SignOutButton = ({
  callbackRoute = '/',
  label,
  className,
}: SignOutButtonProps) => {
  const router = useRouter();

  return (
    <div className={cn('sign-out-button', className)}>
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
