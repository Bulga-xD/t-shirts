"use client";

import { HeroImage } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export const HeroImageDisplay: React.FC<{
  images: HeroImage[];
}> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cycleImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const intervalId = setInterval(cycleImage, 5000);
    return () => clearInterval(intervalId);
  }, [cycleImage]);

  const scaleFadeAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 1 } },
  };

  return (
    <AnimatePresence>
      {images.length > 0 && (
        <motion.div
          key={currentImageIndex}
          variants={scaleFadeAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <img
            src={images[currentImageIndex].image}
            alt={`Background ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
