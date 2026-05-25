'use client';

export async function downloadPaper(filename = 'question-paper.pdf'): Promise<void> {
  // Guard: only runs in browser
  if (typeof window === 'undefined') {
    console.warn('pdf-export: not in browser environment');
    return;
  }

  const element = document.getElementById('paper-document');

  if (!element) {
    console.error('pdf-export: #paper-document element not found');
    alert('Could not find the paper content. Please wait for the page to load fully and try again.');
    return;
  }

  try {
    // Force client-side only import
    const html2pdf = (await import('html2pdf.js' as any)).default;

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'] as string[],
      },
    };

    await html2pdf().set(options).from(element).save();
  } catch (err) {
    console.error('pdf-export: failed', err);
    // Graceful fallback to print dialog
    window.print();
  }
}
