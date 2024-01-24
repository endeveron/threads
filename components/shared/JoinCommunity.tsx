'use client';

import { usePathname } from 'next/navigation';

import { useToast } from '@/components/ui/use-toast';
import Button from '@/components/shared/Button';
import { requestJoinCommunity, test } from '@/lib/actions/community.actions';
import { useState } from 'react';
import { ToastAction } from '@/components/ui/toast';

type TJoinCommunityProps = {
  communityId: string;
  userObjectId: string;
};

const JoinCommunity = ({ communityId, userObjectId }: TJoinCommunityProps) => {
  const pathname = usePathname();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  // Add userObjectId to MongoDb community.requests array
  const handleClick = async () => {
    toast.dismiss();
    try {
      setLoading(true);
      await requestJoinCommunity({
        communityId,
        userObjectId,
        path: pathname,
      });
      toast.toast({
        title: 'Request sent',
        description: 'An invitation will be sent to your email within 48 hours',
      });
    } catch (err: any) {
      // TODO: Handle Error
      console.log('Error joining to community', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-community">
      <Button
        size="sm"
        loading={loading}
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
        Join
      </Button>
    </div>
  );
};

export default JoinCommunity;
