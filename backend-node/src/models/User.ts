import mongoose, { Document, Schema } from 'mongoose';

// This defines what a "User" looks like in our database
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can have the same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'], // only these two values allowed
      default: 'member',
    },
  },
  {
    timestamps: true, // automatically tracks when user was created/updated
  }
);

export default mongoose.model<IUser>('User', userSchema);