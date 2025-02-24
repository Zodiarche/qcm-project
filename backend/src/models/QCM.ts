import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IChoice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  _id: string;
  text: string;
  choices: IChoice[];
}

interface IQCM extends mongoose.Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Définition du schéma pour Question
const questionSchema = new mongoose.Schema<IQuestion>({
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

const qcmSchema = new mongoose.Schema<IQCM>(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQCM>('qcms', qcmSchema);
