'use client';

// Safe hex overrides for all Tailwind CSS variables that use oklch()
// html2canvas cannot parse oklch() so we force everything to hex
const SAFE_CSS_OVERRIDE = `
  *, *::before, *::after {
    color-scheme: light only !important;
  }
  :root {
    --background: #ffffff !important;
    --foreground: #0a0a0a !important;
    --card: #ffffff !important;
    --card-foreground: #0a0a0a !important;
    --popover: #ffffff !important;
    --popover-foreground: #0a0a0a !important;
    --primary: #171717 !important;
    --primary-foreground: #fafafa !important;
    --secondary: #f5f5f5 !important;
    --secondary-foreground: #171717 !important;
    --muted: #f5f5f5 !important;
    --muted-foreground: #737373 !important;
    --accent: #f5f5f5 !important;
    --accent-foreground: #171717 !important;
    --destructive: #ef4444 !important;
    --border: #e5e5e5 !important;
    --input: #e5e5e5 !important;
    --ring: #0a0a0a !important;
    --radius: 0.5rem !important;
    --sidebar-background: #1a1a1a !important;
    --sidebar-foreground: #ffffff !important;
    --sidebar-accent: #2a2a2a !important;
    --sidebar-accent-foreground: #ffffff !important;
    --sidebar-border: #2a2a2a !important;
  }
  body, html {
    background: #ffffff !important;
    color: #0a0a0a !important;
  }
`;

export async function downloadPaper(filename = 'question-paper.pdf'): Promise<void> {
  if (typeof window === 'undefined') return;

  const element = document.getElementById('paper-document');
  if (!element) {
    alert('Could not find the paper content. Please wait for the page to fully load.');
    return;
  }

  // Dynamically import — browser only
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
      // onclone fires after html2canvas clones the document
      // but before it renders — inject safe styles here
      onclone: (clonedDoc: Document) => {
        // 1. Inject style override into cloned document head
        const style = clonedDoc.createElement('style');
        style.textContent = SAFE_CSS_OVERRIDE;
        clonedDoc.head.appendChild(style);

        // 2. Remove every <link> and <style> that contains oklch
        //    to prevent global Tailwind stylesheets from leaking in
        const allStyles = Array.from(
          clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')
        );
        for (const node of allStyles) {
          // skip the one we just added
          if (node === style) continue;
          const content = node.textContent || '';
          if (content.includes('oklch')) {
            node.parentNode?.removeChild(node);
          }
        }

        // 3. Force the paper element itself to safe colors
        const paper = clonedDoc.getElementById('paper-document');
        if (paper) {
          paper.style.cssText += `
            background: #ffffff !important;
            color: #0a0a0a !important;
            font-family: serif !important;
          `;
        }

        // 4. Walk every element and strip oklch from inline styles
        const all = clonedDoc.querySelectorAll('*');
        all.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style) {
            const style = htmlEl.getAttribute('style') || '';
            if (style.includes('oklch')) {
              htmlEl.setAttribute(
                'style',
                style.replace(/oklch\([^)]*\)/g, 'inherit')
              );
            }
          }
        });
      },
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

  try {
    await html2pdf().set(options).from(element).save();
  } catch (err) {
    console.error('PDF generation failed:', err);
    // Fallback: open print dialog
    window.print();
  }
}
