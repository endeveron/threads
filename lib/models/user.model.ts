import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
});

const UserModel = models.User || model('User', userSchema);

export default UserModel;
