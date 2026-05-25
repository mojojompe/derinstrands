import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { MdDownload, MdAutoAwesome } from 'react-icons/md';
import * as htmlToImage from 'html-to-image';
import { toast } from 'react-hot-toast';

type FlyerType = 'promotional' | 'informative';

const MarketingTab: React.FC = () => {
  const [flyerType, setFlyerType] = useState<FlyerType>('promotional');
  const [title, setTitle] = useState('BLACK FRIDAY');
  const [subtitle, setSubtitle] = useState('Exclusive Access. Up to 40% Off Our Premium Bone Straight Collection.');
  const [promoCode, setPromoCode] = useState('DERIN40');
  
  const [infoTitle, setInfoTitle] = useState('HOLIDAY NOTICE');
  const [infoBody, setInfoBody] = useState('Dear valued clients, we will be closing for the festive season starting December 20th. Please ensure all holiday bookings are finalized before the 15th.\n\nThank you for choosing DerinStrands for your crown.');

  const [isGenerating, setIsGenerating] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3888);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setScale(entry.contentRect.width / 1080);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDownload = async () => {
    if (!flyerRef.current) return;
    setIsGenerating(true);
    
    try {
      const dataUrl = await htmlToImage.toPng(flyerRef.current, {
        pixelRatio: 3, 
        backgroundColor: flyerType === 'promotional' ? '#09090B' : '#FFFFFF',
        style: { transform: 'none' }
      });
      
      const link = document.createElement('a');
      link.download = `DerinStrands_${flyerType}_Flyer.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('Flyer saved successfully! Ready for Instagram.');
    } catch (err) {
      toast.error('Failed to generate flyer.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 animate-fade-in">
        
        <div className="mb-6 px-2 sm:px-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
           <div>
             <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight flex items-center gap-2">
               Promo Studio <MdAutoAwesome className="text-brand-pink" />
             </h2>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Design and export luxury flyers</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
          
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-xs font-black text-brand-black uppercase tracking-widest mb-4">Flyer Type</h3>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setFlyerType('promotional')}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${flyerType === 'promotional' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black'}`}
                >
                  Promotional Offer
                </button>
                <button 
                  onClick={() => setFlyerType('informative')}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${flyerType === 'informative' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black'}`}
                >
                  Informative Notice
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {flyerType === 'promotional' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Main Headline</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value.toUpperCase())}
                      className="modern-input text-lg font-black"
                      placeholder="e.g. FLASH SALE"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Offer Details / Subtitle</label>
                    <textarea
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="modern-input resize-none h-24"
                      placeholder="e.g. 20% off all closures"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Promo Code</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="modern-input text-brand-pink font-black text-xl tracking-widest"
                      placeholder="e.g. DERIN20"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Notice Heading</label>
                    <input
                      type="text"
                      value={infoTitle}
                      onChange={(e) => setInfoTitle(e.target.value.toUpperCase())}
                      className="modern-input text-lg font-black"
                      placeholder="e.g. RESTOCK ALERT"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Message Body</label>
                    <textarea
                      value={infoBody}
                      onChange={(e) => setInfoBody(e.target.value)}
                      className="modern-input resize-none h-40 leading-relaxed"
                      placeholder="Type your announcement here..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleDownload}
                disabled={isGenerating || (flyerType === 'promotional' ? !title : !infoTitle)}
                className="w-full flex items-center justify-center gap-2 modern-button-primary !rounded-2xl !py-4 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <MdDownload className="text-xl" />
                    <span>Download Flyer (1080x1080)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* The exported container */}
            <div ref={containerRef} className="relative w-full max-w-[420px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-gray-50 flex items-center justify-center">
              
              <div 
                ref={flyerRef}
                className="absolute top-0 left-0 flex flex-col overflow-hidden"
                style={{
                  width: '1080px',
                  height: '1080px',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                {flyerType === 'promotional' ? (
                  // --- PROMOTIONAL FLYER DESIGN ---
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-20 relative bg-[#09090B]">
                    {/* Pink glowing background accent */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 10%, rgba(255, 20, 147, 0.25) 0%, rgba(9, 9, 11, 0) 60%)'
                      }}
                    />

                    {/* Logo */}
                    <div className="w-24 h-24 rounded-full border-2 border-brand-pink overflow-hidden absolute top-20 shadow-[0_0_40px_rgba(255,20,147,0.3)]">
                      <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </div>

                    <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center">
                      <motion.h1 
                        key={title}
                        className="text-[140px] leading-[0.85] font-black tracking-tighter uppercase text-white drop-shadow-2xl"
                      >
                        {title}
                      </motion.h1>
                      
                      <div className="w-24 h-1 bg-brand-pink my-12" />

                      <motion.p 
                        key={subtitle}
                        className="text-4xl font-bold text-gray-300 max-w-[800px] leading-snug tracking-wide"
                      >
                        {subtitle}
                      </motion.p>
                    </div>

                    <div className="absolute bottom-20 w-full flex flex-col items-center">
                      <p className="text-xl font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Use Code at Checkout</p>
                      <div className="px-20 py-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                        <span className="text-7xl font-black tracking-widest text-brand-pink">{promoCode}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // --- INFORMATIVE FLYER DESIGN ---
                  <div className="w-full h-full flex flex-col p-20 relative bg-white">
                    {/* Soft gradient background */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(252, 231, 243, 0.8) 100%)'
                      }}
                    />

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between w-full border-b-[3px] border-gray-100 pb-12">
                      <div className="flex items-center gap-8">
                        <div className="w-28 h-28 rounded-full border border-gray-200 overflow-hidden shadow-lg">
                          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        </div>
                        <div>
                          <h2 className="text-5xl font-black tracking-tighter italic uppercase text-brand-black">
                            Derin<span className="text-brand-pink">Strands</span>
                          </h2>
                          <p className="text-xl font-bold uppercase tracking-[0.2em] text-gray-500 mt-2">...Good Hair, Good Mood...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black uppercase tracking-widest text-brand-pink">Official Notice</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[850px]">
                      <motion.h1 
                        key={infoTitle}
                        className="text-[80px] leading-tight font-black tracking-tighter uppercase text-brand-black mb-12"
                      >
                        {infoTitle}
                      </motion.h1>
                      
                      <div className="flex gap-12">
                        <div className="w-2 bg-brand-pink shrink-0 rounded-full" />
                        <motion.p 
                          key={infoBody}
                          className="text-4xl font-semibold text-gray-700 leading-[1.6] whitespace-pre-wrap"
                        >
                          {infoBody}
                        </motion.p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 flex items-center justify-between pt-12 border-t-[3px] border-gray-100 mt-auto">
                      <p className="text-2xl font-black text-brand-black tracking-wide">derinstrands@gmail.com</p>
                      <p className="text-2xl font-black text-brand-black tracking-wide">IG: @derinstrands</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </main>
      
      <BottomNav />
    </div>
  );
};

export default MarketingTab;
