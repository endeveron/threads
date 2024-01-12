import { TCommunity } from '@/lib/types/community.types';
import { Schema, model, models } from 'mongoose';

const communitySchema = new Schema<TCommunity>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const CommunityModel = models.Community || model('Community', communitySchema);

export default CommunityModel;
