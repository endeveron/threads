import * as zod from 'zod';

export const UserValidation = zod.object({
  bio: zod
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(1000, { message: 'Maximum 1000 caracters.' }),
  image: zod.string().min(1).url(),
  name: zod
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(30, { message: 'Maximum 30 caracters.' }),
  username: zod
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(30, { message: 'Maximum 30 caracters.' }),
});
