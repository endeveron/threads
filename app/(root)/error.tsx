'use client';

import Button from '@/components/shared/Button';
import { useRouter } from 'next/navigation';

// Error components must be Client Components

// See https://nextjs.org/docs/app/building-your-application/routing/error-handling

// import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error.message);
  // }, [error]);

  return (
    <div className="error-page flex w-full justify-center">
      <div className="error-page_message rounded-lg bg-paper p-8 w-fit flex flex-col items-center">
        <h1 className="head-text mb-4 text-accent">Ooops!</h1>
        <p className="text-base-regular text-secondary mb-10">
          {error?.message || 'Something went wrong.'}
        </p>
        <div className="flex flex-wrap max-xs:gap-4 gap-8">
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
          <Button variant="secondary" onClick={() => router.back()}>
            Previous page
          </Button>
        </div>
      </div>
    </div>
  );
}
