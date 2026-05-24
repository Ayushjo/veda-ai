import { create } from 'zustand';
import { GeneratedPaper } from '@/types';

interface PaperStore {
  paper: GeneratedPaper | null;
  isLoading: boolean;
  error: string | null;
  setPaper: (paper: GeneratedPaper) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePaperStore = create<PaperStore>((set) => ({
  paper: null,
  isLoading: false,
  error: null,
  setPaper: (paper) => set({ paper, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ paper: null, isLoading: false, error: null }),
}));
