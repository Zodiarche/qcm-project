import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('users', userSchema);
