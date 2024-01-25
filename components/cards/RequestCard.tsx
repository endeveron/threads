'use client';

import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';

import Button from '@/components/shared/Button';
import { TRequestCardProps } from '@/lib/types/common.types';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { acceptJoinCommunity } from '@/lib/actions/community.actions';
import { usePathname } from 'next/navigation';
import { useErrorHandler } from '@/lib/utils/hooks';

const RequestCard = ({
  userId,
  authUserId,
  name,
  username,
  email,
  image,
  communityId,
  isCommunityCreator,
}: TRequestCardProps) => {
  const { organization } = useOrganization();
  const pathname = usePathname();
  const { toast } = useToast();
  const { toastError } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const isAuthor = userId === authUserId;

  const inviteUser = async () => {
    if (!organization) {
      toastError({ message: 'Error getting community data from clerk.' });
      return;
    }

    try {
      setLoading(true);

      // See: https://clerk.com/docs/references/javascript/organization-invitation#properties
      const result = await organization.inviteMember({
        emailAddress: email,
        role: 'org:member',
      });

      if (result?.emailAddress) {
        toast({
          title: 'Invitation sent',
          description: `Email has been sent to ${result.emailAddress}`,
        });
      }

      // Remove request from user.requests array
      await acceptJoinCommunity({
        userId,
        communityId,
        path: pathname,
      });
    } catch (err: any) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  const contentEl = (
    <div className="user-card_content">
      <div className="relative h-12 w-12">
        <Image
          src={image}
          alt="user avatar"
          className="rounded-full object-cover"
          sizes="256px"
          fill
        />
      </div>

      <div className="flex-1 text-ellipsis">
        <h4 className="text-base-semibold text-main">{name}</h4>
        <p className="text-small-medium text-tertiary">@{username}</p>
      </div>
    </div>
  );

  return (
    <article className={`user-card${loading ? ' loading' : ''}`}>
      {isAuthor ? (
        contentEl
      ) : (
        <Link href={`/profile/${userId}`}>{contentEl}</Link>
      )}

      {isAuthor && (
        <div className="user-card_message text-small-medium text-tertiary cursor-default">
          SENT
        </div>
      )}

      {organization && isCommunityCreator && (
        <Button size="sm" loading={loading} onClick={inviteUser}>
          Invite
        </Button>
      )}
    </article>
  );
};

export default RequestCard;
