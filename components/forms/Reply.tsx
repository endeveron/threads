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
import Button from '@/components/shared/Button';
import { Input } from '../ui/input';
import { useState } from 'react';

type TFormValues = {
  thread: string;
};

type TCommentProps = {
  threadId: string;
  userImg: string;
  userObjectIdStr: string;
};

const Reply = ({ threadId, userImg, userObjectIdStr }: TCommentProps) => {
  const pathname = usePathname();

  const [isFormValid, setIsFormValid] = useState(false);

  const form = useForm<zod.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  form.formState;

  const onChange = (values: TFormValues) => {
    const inputLength = values.thread.trim().length;
    setIsFormValid(() => !!inputLength);
  };

  const onSubmit = async (values: zod.infer<typeof CommentValidation>) => {
    await addCommentToThread({
      threadId: threadId,
      commentText: values.thread,
      userObjectIdStr: userObjectIdStr,
      path: pathname,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="reply-form"
        onChange={() => onChange(form.getValues())}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center">
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
                  placeholder="Share your thoughts..."
                  className="text-main outline-none no-mt"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!isFormValid}
          className="px-7 max-xs:mt-3 max-xs:w-full max-sm:px-10"
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Reply;
