import mongoose, { Document, Schema } from 'mongoose';

export interface IPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  metadata: {
    subject: string;
    gradeLevel: string;
    totalMarks: number;
    duration: string;
    dueDate: Date;
  };
  sections: {
    title: string;
    instruction: string;
    questions: {
      id: number;
      text: string;
      type: 'mcq' | 'short' | 'long' | 'true-false';
      difficulty: 'easy' | 'medium' | 'hard';
      marks: number;
      options: string[];
    }[];
  }[];
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema(
  {
    id: { type: Number, required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ['mcq', 'short', 'long', 'true-false'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    marks: { type: Number, required: true },
    options: { type: [String], default: [] },
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false },
);

const MetadataSchema = new Schema(
  {
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    duration: { type: String, required: true },
    dueDate: { type: Date, required: true },
  },
  { _id: false },
);

const PaperSchema = new Schema<IPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    metadata: { type: MetadataSchema, required: true },
    sections: { type: [SectionSchema], required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Paper = mongoose.model<IPaper>('Paper', PaperSchema);
