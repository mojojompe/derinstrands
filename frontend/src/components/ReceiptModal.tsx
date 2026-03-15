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
  const previewRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !sale) return null;

  const generateCanvas = async () => {
    if (!captureRef.current) return null;
    
    // Ensure all images are loaded
    const images = captureRef.current.querySelectorAll('img');
    const loadPromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    await Promise.all(loadPromises);

    return await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 600,
      height: 800,
      logging: false
    });
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${sale.buyerName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Receipt_${sale.buyerName.replace(/\s+/g, '_')}.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error("Image Generation failed", error);
      alert("Failed to generate Image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Hello ${sale.buyerName}, thank you for your order at Derin Strands!\n\nOrder ID: #${sale._id.slice(-6).toUpperCase()}\nItems: ${sale.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}\nTotal: ₦${sale.totalPrice.toLocaleString()}\nStatus: ${sale.paymentStatus.toUpperCase()}\n\nWe appreciate your business!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full h-[100dvh] sm:h-auto sm:max-w-4xl sm:max-h-[95vh] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header Actions */}
        <div className="p-4 sm:p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
             <div className="p-2 bg-brand-pink/10 rounded-xl text-brand-pink hidden sm:block">
               <MdFileDownload size={24} />
             </div>
             <div>
               <h2 className="text-base sm:text-xl font-black text-brand-black tracking-tight uppercase italic">Receipt Preview</h2>
               <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Download or share with customer</p>
             </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center space-x-1 sm:space-x-2 bg-brand-black text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-brand-pink transition-all disabled:opacity-50"
            >
              <MdFileDownload className="text-sm sm:text-lg" />
              <span>PDF</span>
            </button>
            <button 
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 border border-gray-100 text-brand-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-white transition-all disabled:opacity-50"
            >
              <MdImage className="text-sm sm:text-lg" />
              <span>IMG</span>
            </button>
            <button 
              onClick={handleWhatsAppShare}
              className="flex items-center space-x-1 sm:space-x-2 bg-green-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-green-600 transition-all"
            >
              <MdShare className="text-sm sm:text-lg" />
              <span className="hidden xs:inline">SHARE</span>
            </button>
            <div className="h-6 w-[1px] bg-gray-200 mx-1 sm:mx-2" />
            <button 
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-brand-black"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 flex justify-center bg-gray-50/50 custom-scrollbar shadow-inner">
           <div className="w-full flex justify-center scale-[0.6] xs:scale-[0.7] sm:scale-100 origin-top h-fit">
             {/* The visible preview component */}
             <div ref={previewRef} className="shadow-2xl">
                <Receipt sale={sale} />
             </div>
           </div>
        </div>

        {/* Generating Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col space-y-4 z-[200]">
             <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
             <p className="font-black text-brand-black tracking-widest text-xs uppercase italic">Processing High-Quality Export...</p>
          </div>
        )}
      </div>

      {/* FIXED SIZE HIDDEN CAPTURE AREA */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-10000px', 
          left: '0', 
          width: '600px', 
          height: '800px', 
          overflow: 'hidden',
          zIndex: -100
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
