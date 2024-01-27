'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import Button from '@/components/shared/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateUser } from '@/lib/actions/user.actions';
import { useUploadThing } from '@/lib/uploadthing';
import { cn, isBase64Image } from '@/lib/utils';
import { UserValidation } from '@/lib/validations/user';
import { useErrorHandler } from '@/lib/utils/hooks';

type TAccountProfileProps = {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    bio?: string;
  };
  btnTitle: string;
};

type TFormValues = {
  bio: string;
  image: string;
  name: string;
  username: string;
};

const AccountProfile = ({ user, btnTitle }: TAccountProfileProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toastError } = useErrorHandler();
  const { startUpload } = useUploadThing('media');

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<zod.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      bio: user?.bio ?? '',
      image: user?.image ?? '',
      name: user?.name ?? '',
      username: user?.username ?? '',
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: TFormValues) => {
    setLoading(true);
    const isImageChanged = isBase64Image(values.image);
    if (isImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes?.length && imgRes[0].url) {
        values.image = imgRes[0].url;
      }
    }
    try {
      await updateUser({
        userId: user.id,
        username: values.username.trim(),
        name: values.name.trim(),
        email: user.email,
        bio: values.bio.trim(),
        image: values.image,
        path: pathname,
      });
      if (pathname === '/profile/edit') {
        router.back();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('form form-card mt-9', {
          inactive: loading,
        })}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="form_image-label">
                <Image
                  src={`${field.value ?? '/assets/profile.svg'}`}
                  alt="profile icon"
                  width={96}
                  height={96}
                  priority
                  className="form_image"
                />
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-tertiary">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="form_field-group">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="form_item">
                <FormLabel className="form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="form_input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="form_item">
                <FormLabel className="form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="form_input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="form_item">
              <FormLabel className="form_label">Bio</FormLabel>
              <FormControl>
                <Textarea rows={5} className="form_input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="form_button-wrapper flex justify-center">
          <Button
            loading={loading}
            size="lg"
            disabled={!form.formState.isDirty}
            type="submit"
            className="button"
          >
            {btnTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountProfile;
