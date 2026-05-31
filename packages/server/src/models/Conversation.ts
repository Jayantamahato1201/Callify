import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  type: 'direct' | 'group';
  participants: mongoose.Types.ObjectId[];
  groupMetadata?: {
    name: string;
    adminIds: mongoose.Types.ObjectId[];
    avatar?: string;
  };
  lastMessageId?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ['direct', 'group'], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    groupMetadata: {
      name: { type: String },
      adminIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      avatar: { type: String }
    },
    lastMessageId: { type: Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
