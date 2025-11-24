import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export const exportCardsToZip = async (containerId: string, filename: string = 'xiaohongshu-posts') => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found');
    return;
  }

  const cards = container.querySelectorAll('.export-card');
  const zip = new JSZip();
  
  // Show loading or progress could be handled by caller via state
  
  const promises = Array.from(cards).map(async (card, index) => {
    const canvas = await html2canvas(card as HTMLElement, {
      scale: 2, // High res for mobile screens
      useCORS: true,
      backgroundColor: null, // Transparent if needed, but cards usually have bg
      logging: false,
    });
    
    return new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          zip.file(`page_${index + 1}.png`, blob);
        }
        resolve();
      }, 'image/png');
    });
  });

  await Promise.all(promises);
  
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Handle different export formats from file-saver in ESM environments
  // Some bundles export saveAs as default, others export an object { saveAs }
  const saveFile = (FileSaver as any).saveAs || FileSaver;
  saveFile(content, `${filename}.zip`);
};