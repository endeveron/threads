import * as zod from 'zod';

export const ThreadValidation = zod.object({
  thread: zod.string().min(3, { message: 'Minimum 3 characters.' }),
  userId: zod.string(),
});

export const CommentValidation = zod.object({
  thread: zod.string().min(3, { message: 'Minimum 3 characters.' }),
});
