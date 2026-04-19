import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface TiltedCardProps {
  imageSrc: string;
  altText: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
}

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  altText,
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent = null,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setX(xPct);
    setY(yPct);
    setScale(scaleOnHover);
  }

  function handleMouseLeave() {
    setX(0);
    setY(0);
    setScale(1);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center w-full h-full"
      style={{ perspective: '600px' }}
    >
      <motion.div
        style={{ width: containerWidth, height: containerHeight }}
        animate={{
          rotateX: y * rotateAmplitude * -1,
          rotateY: x * rotateAmplitude,
          scale,
        }}
        transition={{ type: 'spring', ...springValues }}
        className="relative shadow-[0_16px_40px_rgba(30,35,60,0.08)] rounded-[2rem] overflow-hidden bg-white/40 border border-white/60 backdrop-blur-xl"
      >
        <ImageWithFallback
          src={imageSrc}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover rounded-[2rem] z-0 blur-sm opacity-80 mix-blend-overlay"
        />
        {displayOverlayContent && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white/10 to-white/60">
            {overlayContent}
          </div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.div
          animate={{ x: x * 50, y: y * 50, opacity: scale === 1 ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute z-50 pointer-events-none px-3 py-1.5 rounded-full bg-[#1F2430] text-white text-[12px] font-bold shadow-xl top-[10px] left-1/2 -translate-x-1/2"
        >
          {captionText}
        </motion.div>
      )}
    </div>
  );
};
