import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendship extends Document {
  user1Id: mongoose.Types.ObjectId;
  user2Id: mongoose.Types.ObjectId;
  createdAt: Date;
}

const friendshipSchema = new Schema<IFriendship>(
  {
    user1Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Index to ensure uniqueness and fast lookup
friendshipSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

export const Friendship = mongoose.model<IFriendship>('Friendship', friendshipSchema);
