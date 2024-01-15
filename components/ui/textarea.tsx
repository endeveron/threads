import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md bg-transparent border p-4 text-sm placeholder:text-light-3 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-light-3 ring-offset-white dark:ring-offset-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
