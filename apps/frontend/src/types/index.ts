export type QuestionType = 'mcq' | 'short' | 'long' | 'true-false';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type JobStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface QuestionTypeConfig {
  type: QuestionType;
  count: number;
  marksEach: number;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions: string;
  fileText: string;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[]; // only for MCQ
}

export interface PaperSection {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface PaperMetadata {
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  duration: string;
  dueDate: string;
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  metadata: PaperMetadata;
  sections: PaperSection[];
  generatedAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  totalMarks: number;
  additionalInstructions: string;
  status: AssignmentStatus;
  jobId: string | null;
  paperId: string | null;
  createdAt: string;
}

// WebSocket event payloads
export interface JobQueuedEvent {
  jobId: string;
  assignmentId: string;
}

export interface JobProcessingEvent {
  jobId: string;
  progress: number;
}

export interface JobCompletedEvent {
  jobId: string;
  paperId: string;
}

export interface JobFailedEvent {
  jobId: string;
  error: string;
}
