import { Schema, model, models } from 'mongoose';

const threadSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  text: { type: String, required: true },
});

const ThreadModel = models.Thread || model('Thread', threadSchema);

export default ThreadModel;