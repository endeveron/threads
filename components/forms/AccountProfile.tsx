'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import { Button } from '@/components/ui/button';
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
import { useToast } from '@/components/ui/use-toast';
import { updateUser } from '@/lib/actions/user.actions';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { UserValidation } from '@/lib/validations/user';

type TAccountProfileProps = {
  user: {
    id: string;
    username: string;
    name: string;
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
  const { toast } = useToast();
  const { startUpload } = useUploadThing('media');

  const [files, setFiles] = useState<File[]>([]);
  const [isFormDataChanged, setIsFormDataChanged] = useState(false);

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

  const detectImageChange = (values: TFormValues) => {
    const blob = values.image;
    return isBase64Image(blob);
  };

  const onChange = (values: TFormValues) => {
    setIsFormDataChanged(() => {
      const isImageChanged = detectImageChange(values);
      const isDataImmutable =
        user.bio === values.bio.trim() &&
        user.name === values.name.trim() &&
        user.username === values.username.trim() &&
        !isImageChanged;

      return !isDataImmutable;
    });
  };

  const onSubmit = async (values: TFormValues) => {
    if (!isFormDataChanged) return;

    const isImageChanged = detectImageChange(values);
    if (isImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes?.length && imgRes[0].url) {
        values.image = imgRes[0].url;
      }
    }
    try {
      await updateUser({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.image,
        path: pathname,
      });
      if (pathname === '/profile/edit') {
        router.back();
      } else {
        router.push('/');
      }
    } catch (err) {
      // TODO: Handle error
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        className="form form-card mt-9"
        onChange={() => onChange(form.getValues())}
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
                  sizes=""
                />
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-light-3">
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
                  <Input
                    type="text"
                    className="form_input no-focus"
                    {...field}
                  />
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
                  <Input
                    type="text"
                    className="form_input no-focus"
                    {...field}
                  />
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
                <Textarea rows={5} className="form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="form_button-wrapper flex justify-center">
          <Button
            size="lg"
            disabled={!isFormDataChanged}
            type="submit"
            className="button"
          >
            {btnTitle}
          </Button>

          <Button
            onClick={() => {
              toast({
                title: 'Scheduled: Catch up',
                description: 'Friday, February 10, 2023 at 5:57 PM',
              });
            }}
          >
            Show Toast
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountProfile;
