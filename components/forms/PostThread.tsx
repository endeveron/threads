'use client';

import * as zod from 'zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrganization } from '@clerk/nextjs';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateUser } from '@/lib/actions/user.actions';
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.actions';

interface PostThreadProps {
  userObjectIdStr: string; // Mongo ObjectId
}

const PostThread = ({ userObjectIdStr }: PostThreadProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm<zod.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      userId: userObjectIdStr,
    },
  });

  const onSubmit = async (values: zod.infer<typeof ThreadValidation>) => {
    try {
      await createThread({
        text: values.thread,
        author: userObjectIdStr,
        path: pathname,
        communityId: organization ? organization.id : null,
      });

      router.push('/');
    } catch (err) {
      // TODO: Handle error
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form className="form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="form_item">
              {/* <FormLabel className="form_label">Content</FormLabel> */}
              <FormControl>
                <Textarea
                  rows={10}
                  className="form_input no-focus"
                  placeholder="Share your thoughts..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="form_button-wrapper flex justify-center">
          <Button type="submit" className="button button--large">
            Create Thread
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostThread;
