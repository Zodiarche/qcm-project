import mongoose from 'mongoose';

interface IChoice {
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  text: string;
  choices: IChoice[];
}

interface IResponse {
  question: IQuestion;
  selectedChoice: string;
  isCorrect: boolean;
}

interface IResult extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  qcm: mongoose.Schema.Types.ObjectId;
  title: string;
  score: number;
  responses: IResponse[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new mongoose.Schema<IResult>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    qcm: { type: mongoose.Schema.Types.ObjectId, ref: 'qcms', required: true },
    title: { type: String, required: true },
    score: { type: Number, required: true },
    responses: [
      {
        question: {
          text: { type: String, required: true },
          choices: [
            {
              text: { type: String, required: true },
              isCorrect: { type: Boolean, required: true },
            },
          ],
        },
        selectedChoice: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IResult>('results', resultSchema);
