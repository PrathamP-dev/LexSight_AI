'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// iOS-inspired spring physics for smooth, natural animations
const springTransition = {
  type: "spring",
  damping: 25,
  stiffness: 120,
  mass: 0.8,
};

const pageVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.96,
    y: 20,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      ...springTransition,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.04,
    y: -12,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 200,
      mass: 0.6,
      duration: 0.15
    }
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          // GPU acceleration for smoother performance
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
