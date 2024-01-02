import * as zod from 'zod';

export const UserValidation = zod.object({
  profile_photo: zod.string().min(1).url(),
  name: zod
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(30, { message: 'Maximum 30 caracters.' }),
  username: zod
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(30, { message: 'Maximum 30 caracters.' }),
  bio: zod
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(1000, { message: 'Maximum 1000 caracters.' }),
});
