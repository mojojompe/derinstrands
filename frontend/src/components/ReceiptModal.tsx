import React, { useRef, useState } from 'react';
import { MdClose, MdPictureAsPdf, MdImage } from 'react-icons/md';
import { MdShare } from 'react-icons/md';
import type { ISale } from '../types';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import Receipt from './Receipt';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: ISale | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, sale }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const captureAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !sale) return null;

  const performCapture = async (): Promise<string | null> => {
    if (!captureAreaRef.current) return null;
    try {
      const dataUrl = await htmlToImage.toPng(captureAreaRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          opacity: '1',
          visibility: 'visible'
        }
      });
      return dataUrl;
    } catch (err) {
      alert(`Capture failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const dataUrl = await performCapture();
    if (dataUrl) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      
      // Calculate height dynamically based on standard receipt ratio, or just a generic ratio
      const height = (800 * width) / 420; 
      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      pdf.save(`Receipt_${sale.buyerName.replace(/\s+/g, '_')}.pdf`);
    }
    setIsGenerating(false);
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    const dataUrl = await performCapture();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `Receipt_${sale.buyerName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    }
    setIsGenerating(false);
  };

  const handleShare = async () => {
    const shareText = `Hello ${sale.buyerName}, here is your receipt from DerinStrands.\n\nTotal: ₦${sale.totalPrice.toLocaleString()}\nStatus: ${sale.paymentStatus.toUpperCase()}\n\nThank you for choosing us! 💗`;
    setIsGenerating(true);
    const dataUrl = await performCapture();
    if (!dataUrl) { setIsGenerating(false); return; }

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Receipt_${sale._id.slice(-6)}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'DerinStrands Receipt', text: shareText }); }
        catch { handleDownloadImage(); window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank'); }
      } else {
        handleDownloadImage();
        setTimeout(() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank'), 500);
      }
    } catch (e) {
      handleDownloadImage();
    }
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Shell */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative bg-white w-full h-full sm:w-[80vw] sm:max-w-5xl sm:h-[85vh] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100"
      >
        {/* Toolbar */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-black text-brand-black uppercase tracking-widest">Receipt Preview</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              {sale.buyerName} · #{sale._id.slice(-6).toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF} disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-pink transition-all disabled:opacity-50"
            >
              <MdPictureAsPdf className="text-lg" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>
            <button
              onClick={handleDownloadImage} disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-brand-black text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <MdImage className="text-lg" />
              <span className="hidden sm:inline">Save Image</span>
            </button>
            <button
              onClick={handleShare} disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1ebe5d] transition-all disabled:opacity-50"
            >
              <MdShare className="text-lg" />
              <span className="hidden sm:inline">Send</span>
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center items-start bg-gray-50 custom-scrollbar">
          <div className="w-full max-w-[420px] origin-top h-fit mx-auto">
            <div className="shadow-2xl ring-1 ring-black/5 rounded-sm overflow-hidden">
              <Receipt sale={sale} />
            </div>
          </div>
        </div>

        {/* Generating overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[210] flex flex-col items-center justify-center gap-4"
            >
              <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                Preparing Receipt...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: -1,
          pointerEvents: 'none', opacity: 0.01,
          width: '420px', overflow: 'hidden', backgroundColor: '#fff'
        }}
        data-capture-container="true"
      >
        <div ref={captureAreaRef} style={{ width: '420px', background: '#fff' }}>
          <Receipt sale={sale} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
