'use client';

import Button from '@/components/shared/Button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { test } from '@/lib/actions/community.actions';
import { usePathname } from 'next/navigation';

interface TestProps {}

const Test = ({}: TestProps) => {
  const toast = useToast();
  const pathnaame = usePathname();

  const handleClick = async () => {
    toast.dismiss();
    try {
      await test(pathnaame);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="test">
      <Button
        size="sm"
        onClick={() => {
          toast.toast({
            description:
              'You will be joined as soon as admin approves your request',
            action: (
              <ToastAction onClick={handleClick} altText="Send request">
                Send request
              </ToastAction>
            ),
            duration: 8000,
          });
        }}
      >
        Test
      </Button>
    </div>
  );
};

export default Test;
