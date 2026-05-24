import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: Date;
  questionTypes: {
    type: 'mcq' | 'short' | 'long' | 'true-false';
    count: number;
    marksEach: number;
  }[];
  totalMarks: number;
  additionalInstructions: string;
  fileText: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string | null;
  paperId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeConfigSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['mcq', 'short', 'long', 'true-false'],
      required: true,
    },
    count: {
      type: Number,
      min: 1,
      required: true,
    },
    marksEach: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  { _id: false },
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: {
      type: [QuestionTypeConfigSchema],
      required: true,
    },
    totalMarks: { type: Number, required: true },
    additionalInstructions: { type: String, default: '' },
    fileText: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    jobId: { type: String, default: null },
    paperId: { type: Schema.Types.ObjectId, ref: 'Paper', default: null },
  },
  { timestamps: true },
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
