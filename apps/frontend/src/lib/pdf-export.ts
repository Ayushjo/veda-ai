'use client';

export async function downloadPaper(_filename?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  window.print();
}
