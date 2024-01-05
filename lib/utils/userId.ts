import mongoose from 'mongoose';

export const getUserIdPropName = (userId: string): '_id' | 'id' | null => {
  // The User object has:
  // '_id' property for the Mongo ObjectId (6595ab68c4e5ce111ece5122),
  // 'id' property for the ClerkId (user_2ZoD8ShHfUWnRyeEhTg8HKirSBU)
  // We can fetch user by MongoDB ObjectId or Clerk Id

  const clerkIdRegex = /user_[a-zA-Z0-9]{24}/;
  const isClerkId = clerkIdRegex.test(userId);
  const isMongoId = mongoose.Types.ObjectId.isValid(userId);

  if (!isClerkId && !isMongoId) return null;
  return isClerkId ? 'id' : '_id';
};
