import React from 'react';
import {
  ButtonProps,
  Button as ShadcnButton,
  buttonVariants,
} from '../ui/button';
import { cn } from '@/lib/utils';
import { WithChildren } from '@/lib/types/common.types';

type TButtonProps = ButtonProps &
  WithChildren & {
    loading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, TButtonProps>(
  (
    { children, loading, className, variant, size, asChild = false, ...props },
    ref
  ) => {
    return (
      <ShadcnButton
        className={cn(
          buttonVariants({ variant, size, className }),
          'button transition-opacity',
          {
            loading: loading,
          }
        )}
        ref={ref}
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }
);
Button.displayName = 'Button';

export default Button;
