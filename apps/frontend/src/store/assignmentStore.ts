import { create } from 'zustand';
import { AssignmentFormData, JobStatus } from '@/types';

interface AssignmentStore {
  form: Partial<AssignmentFormData>;
  jobStatus: JobStatus;
  assignmentId: string | null;
  paperId: string | null;
  setAssignment: (assignmentId: string, paperId?: string) => void;
  setJobStatus: (status: JobStatus) => void;
  setPaperId: (paperId: string) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  form: {},
  jobStatus: 'idle',
  assignmentId: null,
  paperId: null,
  setAssignment: (assignmentId) => set({ assignmentId }),
  setJobStatus: (jobStatus) => set({ jobStatus }),
  setPaperId: (paperId) => set({ paperId }),
  reset: () => set({ form: {}, jobStatus: 'idle', assignmentId: null, paperId: null }),
}));
