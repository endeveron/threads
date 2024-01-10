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
  userId: string; // Mongo ObjectId
}

const PostThread = ({ userId }: PostThreadProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm<zod.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      userId: userId,
    },
  });

  const onSubmit = async (values: zod.infer<typeof ThreadValidation>) => {
    try {
      await createThread({
        text: values.thread,
        author: userId,
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
      <form className="form mt-9" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="form_item">
              {/* <FormLabel className="form_label">Content</FormLabel> */}
              <FormControl>
                <Textarea
                  rows={15}
                  className="form_input no-focus"
                  placeholder="Type something..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="button py-7">
          Create Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
