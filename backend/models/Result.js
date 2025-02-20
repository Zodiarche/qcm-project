import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    qcm: { type: mongoose.Schema.Types.ObjectId, ref: 'qcms', required: true },
    score: { type: Number, required: true },
    responses: [
      {
        question: {
          text: String,
          choices: [
            {
              text: String,
              isCorrect: Boolean,
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

export default mongoose.model('results', resultSchema);
