import React, { useRef, useState } from 'react';
import { MdClose, MdFileDownload, MdImage, MdShare } from 'react-icons/md';
import type { ISale } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Receipt from './Receipt';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: ISale | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, sale }) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !sale) return null;

  const generateFile = async (type: 'image' | 'blob'): Promise<string | Blob | null> => {
    if (!captureRef.current) return null;
    
    // Ensure images are fully loaded
    const images = captureRef.current.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    const canvas = await html2canvas(captureRef.current, {
      scale: 3, // High resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 600,
      height: 800,
      logging: false
    });

    if (type === 'image') return canvas.toDataURL('image/png');
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
    });
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      if (!captureRef.current) return;
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 600,
        height: 800
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${sale.buyerName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Export failed. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const imgData = await generateFile('image') as string;
      if (!imgData) return;
      const link = document.createElement('a');
      link.download = `Receipt_${sale.buyerName.replace(/\s+/g, '_')}.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error("Image Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Hello ${sale.buyerName}, here is your receipt from Derin Strands!\n\nTotal: ₦${sale.totalPrice.toLocaleString()}\nStatus: ${sale.paymentStatus.toUpperCase()}\n\nThank you for your business!`;
    
    setIsGenerating(true);
    try {
      const blob = await generateFile('blob') as Blob;
      if (!blob) throw new Error("Could not generate image");

      const file = new File([blob], `Receipt_${sale._id.slice(-6)}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Derin Strands Receipt',
          text: shareText,
        });
      } else {
        // Fallback for desktop/unsupported browsers
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error("Sharing failed", error);
      // Fallback
      const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(fallbackUrl, '_blank');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90dvh] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in border border-white/20">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-brand-pink/10 rounded-xl text-brand-pink hidden sm:block">
               <MdFileDownload size={24} />
             </div>
             <div>
               <h2 className="text-sm sm:text-xl font-black text-brand-black tracking-tight italic uppercase">Receipt Preview</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Verify and share with customer</p>
             </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating}
              className="flex items-center space-x-1 sm:space-x-2 bg-brand-black text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-brand-pink transition-all disabled:opacity-50"
            >
              <MdFileDownload /> <span>PDF</span>
            </button>
            <button 
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 border border-gray-100 text-brand-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-white transition-all disabled:opacity-50"
            >
              <MdImage /> <span>IMG</span>
            </button>
            <button 
              onClick={handleShare}
              disabled={isGenerating}
              className="flex items-center space-x-1 sm:space-x-2 bg-green-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-green-600 transition-all"
            >
              <MdShare /> <span>SHARE</span>
            </button>
            <div className="h-6 w-[1px] bg-gray-200 mx-1 sm:mx-2" />
            <button onClick={onClose} className="p-1 sm:p-2 text-gray-400 hover:text-brand-black">
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 flex justify-center bg-gray-100/50 custom-scrollbar shadow-inner">
           <div className="w-full flex justify-center scale-[0.6] xs:scale-[0.8] sm:scale-100 origin-top h-fit pb-20">
              <div className="shadow-2xl">
                 <Receipt sale={sale} />
              </div>
           </div>
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[210] flex items-center justify-center flex-col">
             <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-xs font-black text-brand-black uppercase italic tracking-widest">Processing High Quality Export...</p>
          </div>
        )}
      </div>

      {/* Hidden Capture Area (Off-screen but fixed) */}
      <div 
        style={{ 
          position: 'fixed', 
          top: '0', 
          left: '-2000px', 
          width: '600px', 
          height: '800px', 
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        <div ref={captureRef} style={{ width: '600px', height: '800px' }}>
          <Receipt sale={sale} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
