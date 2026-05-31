import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
  fileUrl?: string;
  readBy: { userId: mongoose.Types.ObjectId; readAt: Date }[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    type: { type: String, enum: ['text', 'image', 'video', 'file', 'voice', 'system'], default: 'text' },
    fileUrl: { type: String },
    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now }
      }
    ],
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
