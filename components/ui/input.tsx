import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full bg-transparent rounded-md border p-4 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-light-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-light-3 ring-offset-white dark:ring-offset-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
