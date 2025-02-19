import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('users', userSchema);
