import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

export const useErrorHandler = () => {
  const toast = useToast();

  /**
   * Displays an error toast with a title and description based on the provided error object.
   * @param {any} err an object that represents an error. The code is specifically accessing the `message` property of the `err` object. If the `message` property exists and is truthy, it will be used as the description in the toast notification.
   */
  const toastError = (err: any) => {
    if (!err) return;
    let title = 'Oops!';
    let description = null;

    // Handle a default error object
    if (err?.message) {
      description = err.message;
    }

    // Handle an error object provided by clerk
    if (err?.errors?.length) {
      const error = err?.errors[0];
      const msg = error?.message;
      // Capitalize the first letter of the error message
      if (msg) title = msg.charAt(0).toUpperCase() + msg.slice(1);
      if (error?.longMessage) description = error.longMessage;
    }

    toast.toast({
      variant: 'destructive',
      title,
      description,
    });
  };

  return { toastError };
};

export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
