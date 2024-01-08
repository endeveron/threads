'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { addCommentToThread } from '@/lib/actions/thread.actions';
import { CommentValidation } from '@/lib/validations/thread';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CommentProps {
  threadId: string;
  userImg: string;
  userId: string; // MongoDb ObjectId
}

const Comment = ({ threadId, userImg, userId }: CommentProps) => {
  const pathname = usePathname();

  const form = useForm<zod.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async (values: zod.infer<typeof CommentValidation>) => {
    await addCommentToThread({
      threadId: threadId,
      commentText: values.thread,
      userId,
      path: pathname,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={userImg}
                  alt="user avatar"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  sizes=""
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none no-mt"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="button px-7 max-sm:px-4">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
