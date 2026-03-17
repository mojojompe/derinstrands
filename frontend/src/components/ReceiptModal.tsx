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
  const [isGenerating, setIsGenerating] = useState(false);
  const captureAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !sale) return null;

  const performCapture = async (): Promise<HTMLCanvasElement | null> => {
    if (!captureAreaRef.current) {
       alert("Capture system error: Node not found");
       return null;
    }
    
    try {
      // Robust image pre-loading
      const images = captureAreaRef.current.querySelectorAll('img');
      const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);

      // We wait a tiny bit to ensure layout is settled
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(captureAreaRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 600,
        height: 800,
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
           // Ensure the captured element is visible in the cloned DOM
           const el = clonedDoc.querySelector('[data-capture-container="true"]') as HTMLElement;
           if (el) {
             el.style.opacity = '1';
             el.style.visibility = 'visible';
             el.style.position = 'static';
           }
        }
      });
      return canvas;
    } catch (err) {
      alert(`Capture engine failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const canvas = await performCapture();
    if (canvas) {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.save(`Receipt_${sale.buyerName.replace(/\s+/g, '_')}.pdf`);
    }
    setIsGenerating(false);
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    const canvas = await performCapture();
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Receipt_${sale.buyerName.replace(/\s+/g, '_')}.png`;
      link.href = imgData;
      link.click();
    }
    setIsGenerating(false);
  };

  const handleShare = async () => {
    const shareText = `Hello ${sale.buyerName}, here is your receipt from Derin Strands.\n\nTotal: ₦${sale.totalPrice.toLocaleString()}\nStatus: ${sale.paymentStatus.toUpperCase()}\n\nThank you for choosing us!`;
    
    setIsGenerating(true);
    const canvas = await performCapture();
    
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Image processing failed. Sending text summary only.");
          const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
          window.open(url, '_blank');
          setIsGenerating(false);
          return;
        }

        const file = new File([blob], `Receipt_${sale._id.slice(-6)}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Derin Strands Receipt',
              text: shareText
            });
          } catch (e) {
            console.warn("Navigator share failed", e);
            // Revert to image download + msg instructions
            handleDownloadImage();
            setTimeout(() => {
                alert("Sharing failed. Receipt has been downloaded. Please attach it manually in WhatsApp.");
                const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                window.open(url, '_blank');
            }, 500);
          }
        } else {
          // Manual fallback: Download + Whatsapp
          handleDownloadImage();
          setTimeout(() => {
              alert("Modern sharing not supported on this browser. Receipt downloaded - please attach it to your WhatsApp message.");
              const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
              window.open(url, '_blank');
          }, 500);
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      setIsGenerating(false);
      const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-black/50 backdrop-blur-md" onClick={onClose} />
      
      {/* Visual Modal */}
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90dvh] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in border border-white/20">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-sm sm:text-xl font-black text-brand-black italic uppercase italic tracking-tight">Receipt Preview</h2>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3">
             <button onClick={handleDownloadPDF} disabled={isGenerating} className="icon-btn-gold flex items-center space-x-1 sm:space-x-2 bg-brand-black text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs font-black hover:bg-brand-pink transition-all">
               <MdFileDownload size={18} /> <span>PDF</span>
             </button>
             <button onClick={handleDownloadImage} disabled={isGenerating} className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 text-brand-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs font-black hover:bg-white transition-all">
               <MdImage size={18} /> <span>IMG</span>
             </button>
             <button onClick={handleShare} disabled={isGenerating} className="flex items-center space-x-1 sm:space-x-2 bg-green-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs font-black hover:bg-green-600 transition-all">
               <MdShare size={18} /> <span>SHARE</span>
             </button>
             <div className="h-6 w-[1px] bg-gray-200 mx-1 sm:mx-2" />
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-brand-black transition-colors">
               <MdClose size={24} />
             </button>
          </div>
        </div>

        {/* Scrollable Preview Area (Visible to user) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 flex justify-center bg-gray-50/50 custom-scrollbar shadow-inner">
           <div className="scale-[0.55] xs:scale-[0.75] sm:scale-100 origin-top h-fit pb-10">
              <div className="shadow-2xl ring-1 ring-black/5">
                 <Receipt sale={sale} />
              </div>
           </div>
        </div>

        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[210] flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest text-brand-black animate-pulse">Generating Receipt...</p>
          </div>
        )}
      </div>

      {/* 
          ULTRA ROBUST CAPTURE NODE
          Placed on screen but with near-zero opacity. 
          Absolute positioning avoids shifting the main layout.
      */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '0', 
          left: '0', 
          zIndex: -1, 
          pointerEvents: 'none',
          opacity: 0.01, // Near-zero but NOT 0 (some browsers skip rendering opacity 0)
          width: '600px',
          height: '800px',
          overflow: 'hidden',
          backgroundColor: '#fff'
        }}
        data-capture-container="true"
      >
        <div ref={captureAreaRef} style={{ width: '600px', height: '800px', background: '#fff' }}>
           <Receipt sale={sale} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
