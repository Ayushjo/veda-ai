'use client';

export async function downloadPaper(
  filename = 'question-paper.pdf'
): Promise<void> {
  if (typeof window === 'undefined') return;

  const element = document.getElementById('paper-document');
  if (!element) {
    alert('Could not find the paper content. Please wait for the page to fully load and try again.');
    return;
  }

  try {
    // dom-to-image-more supports oklch, oklch, lch, lab, and all
    // modern CSS color functions — unlike html2canvas
    const domtoimage = (await import('dom-to-image-more')).default;
    const { jsPDF } = await import('jspdf');

    // Get element dimensions
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Convert element to PNG blob at 2x scale for retina quality
    const blob = await domtoimage.toBlob(element, {
      width: elementWidth * 2,
      height: elementHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: elementWidth + 'px',
        height: elementHeight + 'px',
      },
    });

    // Convert blob to data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // Calculate dimensions to fit A4
    const imgWidthMm = a4Width - 20; // 10mm margin each side
    const imgHeightMm = (elementHeight / elementWidth) * imgWidthMm;

    // Create PDF — add extra pages if content exceeds one A4 page
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });

    let remainingHeight = imgHeightMm;
    let yOffset = 0;
    const pageContentHeight = a4Height - 20; // 10mm margin top/bottom

    while (remainingHeight > 0) {
      if (yOffset > 0) pdf.addPage();

      pdf.addImage(
        dataUrl,
        'PNG',
        10,            // x margin
        10 - yOffset,  // y position (negative to scroll through image)
        imgWidthMm,
        imgHeightMm
      );

      yOffset += pageContentHeight;
      remainingHeight -= pageContentHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('PDF generation failed:', err);
    // Graceful fallback to print dialog
    window.print();
  }
}
