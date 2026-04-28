import React from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.04,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay },
    },
  };

  const child = {
    hidden: { 
      filter: 'blur(10px)', 
      opacity: 0, 
      y: direction === 'top' ? -20 : 20 
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: { type: 'spring', bounce: 0.2, duration: 0.8 },
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className ?? ''}`}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.p>
  );
};
