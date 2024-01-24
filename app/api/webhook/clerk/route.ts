/* eslint-disable camelcase */
// Resource: https://clerk.com/docs/users/sync-data
// Above article shows why we need webhooks i.e., to sync data to our backend

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { headers } from 'next/headers';

import { IncomingHttpHeaders } from 'http';

import { NextResponse } from 'next/server';
import {
  addUserToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from '@/lib/actions/community.actions';
import logger from '@/lib/utils/logger';

// Resource: https://clerk.com/docs/integration/webhooks#supported-events
// Above document lists the supported events
type EventType =
  | 'organization.created'
  | 'organizationInvitation.created'
  | 'organizationMembership.created'
  | 'organizationMembership.deleted'
  | 'organization.updated'
  | 'organization.deleted';

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: 'event';
  type: EventType;
};

export const POST = async (request: Request) => {
  const payload = await request.json();
  const header = headers();

  const heads = {
    'svix-id': header.get('svix-id'),
    'svix-timestamp': header.get('svix-timestamp'),
    'svix-signature': header.get('svix-signature'),
  };

  // Activitate Webhook in the Clerk Dashboard.
  // After adding the endpoint, you'll see the secret on the right side.
  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || '');

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }

  const eventType: EventType = evnt?.type!;

  // Listen organization creation event
  if (eventType === 'organization.created') {
    // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
    // Show what evnt?.data sends from above resource
    const { id, name, slug, logo_url, image_url, created_by } =
      evnt?.data ?? {};

    try {
      await createCommunity({
        id: id as string,
        name: name as string,
        username: slug as string,
        image: (logo_url || image_url) as string,
        bio: 'A new organization',
        createdById: created_by as string,
      });

      return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // Listen organization invitation creation event.
  // Just to show. You can avoid this or tell people that we can create a new mongoose action and
  // add pending invites in the database.
  if (eventType === 'organizationInvitation.created') {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
      logger.g('Invitation created', evnt?.data);

      return NextResponse.json(
        { message: 'Invitation created' },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // Listen organization membership (member invite & accepted) creation
  if (eventType === 'organizationMembership.created') {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evnt?.data;
      logger.g('User successfully added to organization.', evnt?.data);

      // @ts-ignore
      await addUserToCommunity(public_user_data.user_id, organization.id);

      return NextResponse.json(
        { message: 'Invitation accepted' },
        { status: 201 }
      );
    } catch (err) {
      logger.r('Error adding user to organization', err);

      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // Listen member deletion event
  if (eventType === 'organizationMembership.deleted') {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evnt?.data;
      logger.g('User successfully removed from organization.', evnt?.data);

      // @ts-ignore
      await removeUserFromCommunity(public_user_data.user_id, organization.id);

      return NextResponse.json({ message: 'Member removed' }, { status: 201 });
    } catch (err) {
      logger.r('Error removing user from organization', err);

      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // Listen organization updation event
  if (eventType === 'organization.updated') {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
      // Show what evnt?.data sends from above resource
      const { id, logo_url, name, slug } = evnt?.data;
      logger.g('Community successfully updated.', evnt?.data);

      await updateCommunityInfo({
        id: id.toString(),
        name: name.toString(),
        username: slug.toString(),
        image: logo_url.toString(),
      });

      return NextResponse.json({ message: 'Member removed' }, { status: 201 });
    } catch (err) {
      logger.r('Error updating organization', err);

      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // Listen organization deletion event
  if (eventType === 'organization.deleted') {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
      // Show what evnt?.data sends from above resource
      const { id } = evnt?.data;
      const communityId = id.toString();
      logger.g('Community successfully deleted.', evnt?.data);

      await deleteCommunity(communityId);

      return NextResponse.json(
        { message: 'Organization deleted' },
        { status: 201 }
      );
    } catch (err: any) {
      logger.r('Error deleding organization', err);

      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
};
