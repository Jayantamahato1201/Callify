import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profilePicture?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    lastSeen: { type: Date },
    privacySettings: {
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
