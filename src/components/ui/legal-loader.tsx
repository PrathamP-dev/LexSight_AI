
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LegalLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LegalLoader({ className, size = 'md' }: LegalLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Gavel Handle */}
      <motion.div
        className="absolute origin-bottom-right"
        animate={{
          rotate: [0, -25, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('text-primary', sizeClasses[size])}
        >
          {/* Gavel head */}
          <rect x="14" y="2" width="8" height="4" rx="1" />
          {/* Gavel handle */}
          <path d="M14 4L4 14" />
          <path d="M13 5L3 15" />
        </svg>
      </motion.div>

      {/* Sound block */}
      <motion.div
        className="absolute bottom-0 left-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('text-accent', sizeClasses[size])}
        >
          <rect x="2" y="18" width="8" height="4" rx="1" />
        </svg>
      </motion.div>

      {/* Impact waves */}
      <motion.div
        className="absolute bottom-1 left-1"
        animate={{
          scale: [0.8, 1.3, 0.8],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 0.5, 1],
        }}
      >
        <div className={cn('rounded-full border-2 border-primary/40', sizeClasses[size])} />
      </motion.div>
    </div>
  );
}

export function LegalLoaderFullScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LegalLoader size="lg" />
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
