import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const motto = "...Good Hair, Good Mood...";

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2.8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#F9FAFB] flex flex-col items-center justify-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-brand-pink shadow-[0_0_40px_rgba(255,20,147,0.2)] mb-6">
              <img src="/logo.jpg" alt="DerinStrands Logo" className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-brand-black tracking-tighter italic uppercase mb-4">
              Derin<span className="text-brand-pink">Strands</span>
            </h1>

            <div className="h-6 flex items-center justify-center">
              <motion.p 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: 0.5 }
                  }
                }}
                className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-[0.2em]"
              >
                {motto.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
