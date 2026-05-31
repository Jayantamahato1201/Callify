import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
  type: 'friend_request' | 'missed_call' | 'group_invite' | 'system';
  content: string;
  isRead: boolean;
  relatedEntityId?: mongoose.Types.ObjectId; // e.g. FriendRequest ID, Conversation ID
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['friend_request', 'missed_call', 'group_invite', 'system'], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedEntityId: { type: Schema.Types.ObjectId }
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
