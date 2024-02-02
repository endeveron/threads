'use client';

import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import Button from '@/components/shared/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { createThread } from '@/lib/actions/thread.actions';
import { useErrorHandler } from '@/lib/utils/hooks';
import { ThreadValidation } from '@/lib/validations/thread';

interface PostThreadProps {
  userObjectId: string; // Mongo ObjectId
}

const PostThread = ({ userObjectId }: PostThreadProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const { toastError } = useErrorHandler();

  const [loading, setLoading] = useState(false);

  const form = useForm<zod.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      userId: userObjectId,
    },
  });

  const onSubmit = async (values: zod.infer<typeof ThreadValidation>) => {
    try {
      setLoading(true);
      await createThread({
        text: values.thread,
        author: userObjectId,
        path: pathname,
        communityId: organization ? organization.id : null,
      });

      router.push('/');
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
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
                  className="form_input"
                  placeholder="Share your thoughts..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="form_button-wrapper flex justify-center">
          <Button
            loading={loading}
            disabled={!form.formState.isDirty}
            size="lg"
            type="submit"
          >
            Create Thread
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostThread;
