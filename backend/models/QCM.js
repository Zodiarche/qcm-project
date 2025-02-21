import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const questionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  text: { type: String, required: true },
  choices: [
    {
      _id: { type: String, default: uuidv4 },
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const qcmSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('qcms', qcmSchema);
