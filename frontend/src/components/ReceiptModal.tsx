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
  const containerRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !sale) return null;

  const prepareCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!captureRef.current) return null;
    
    // Ensure images are fully loaded with crossOrigin check
    const images = captureRef.current.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // html2canvas options for maximum compatibility
    return await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 600,
      height: 800,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 600,
      windowHeight: 800,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('receipt-capture-node');
        if (el) {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        }
      }
    });
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const canvas = await prepareCanvas();
      if (!canvas) throw new Error("Canvas generation failed");
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${sale.buyerName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("PDF Export failed. Please try capturing a screenshot manually if this persists.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = await prepareCanvas();
      if (!canvas) return;
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Receipt_${sale.buyerName.replace(/\s+/g, '_')}_${new Date().getTime()}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Image Export failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Hello ${sale.buyerName}, here is your receipt from Derin Strands!\n\nTotal: ₦${sale.totalPrice.toLocaleString()}\nStatus: ${sale.paymentStatus.toUpperCase()}\n\nThank you for choosing us!`;
    
    setIsGenerating(true);
    try {
      const canvas = await prepareCanvas();
      if (!canvas) throw new Error("Could not generate receipt image");

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Blob creation failed");
        }

        const file = new File([blob], `Receipt_${sale._id.slice(-6)}.png`, { type: 'image/png' });

        // Check if Web Share API is available and supports files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Derin Strands Receipt',
              text: shareText,
            });
          } catch (err) {
            console.warn("Share failed, falling back to text", err);
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappUrl, '_blank');
          }
        } else {
          // Fallback to basic WhatsApp share (text only)
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
          window.open(whatsappUrl, '_blank');
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error("Advanced Sharing failed:", error);
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      setIsGenerating(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[95dvh] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
        
        {/* Header toolbar */}
        <div className="p-4 sm:p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-brand-pink/10 rounded-xl text-brand-pink hidden sm:block">
               <MdFileDownload size={24} />
             </div>
             <div>
               <h2 className="text-sm sm:text-xl font-black text-brand-black tracking-tighter italic uppercase">Receipt View</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Download or share receipts</p>
             </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
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
              className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 border border-gray-200 text-brand-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-white transition-all disabled:opacity-50"
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

        {/* Scalable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 flex justify-center bg-gray-100/30 custom-scrollbar shadow-inner">
           <div className="w-full flex justify-center scale-[0.6] xs:scale-[0.8] sm:scale-100 origin-top h-fit pb-12">
              <div className="shadow-2xl border border-gray-200 bg-white">
                 <Receipt sale={sale} />
              </div>
           </div>
        </div>

        {/* Processing State */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[210] flex items-center justify-center flex-col">
             <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-xs font-black text-brand-black uppercase italic tracking-widest animate-pulse">Capturing Document...</p>
          </div>
        )}
      </div>

      {/* 
          ROBUST CAPTURE TARGET 
          We place it in the DOM but hidden from user. 
          Use display: 'block' but absolute positioning way off-screen or zero opacity.
          html2canvas needs the element to be in the document.
      */}
      <div 
        id="receipt-capture-node"
        style={{ 
          position: 'absolute', 
          top: '0', 
          left: '0', 
          zIndex: -50,
          opacity: 0,
          pointerEvents: 'none',
          width: '600px',
          height: '800px',
          overflow: 'hidden'
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
