'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface MotionExampleProps {
  className?: string;
}

export default function MotionExample({ className }: MotionExampleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className={`flex flex-col items-center space-y-8 py-10 ${className}`}>
      <h2 className="text-2xl font-bold">Framer Motion Examples</h2>
      
      {/* Simple hover animation */}
      <motion.div
        className="bg-blue-500 text-white p-4 rounded-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        Hover or tap me!
      </motion.div>

      {/* Click to animate */}
      <motion.div
        className="bg-purple-500 text-white p-4 rounded-lg cursor-pointer"
        animate={{
          scale: isAnimating ? 1.2 : 1,
          rotate: isAnimating ? 180 : 0,
          borderRadius: isAnimating ? '50%' : '8px',
        }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsAnimating(!isAnimating)}
      >
        Click me to animate!
      </motion.div>

      {/* Staggered list animation */}
      <div className="flex flex-col space-y-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            className="bg-green-500 text-white p-3 rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
          >
            Item {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
