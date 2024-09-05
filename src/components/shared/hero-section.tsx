"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = ["/assets/hero/hero1.png", "/assets/hero/hero2.png"];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scaleFadeAnimation = {
    initial: { opacity: 0, scale: 0.95 }, // Start smaller and transparent
    animate: { opacity: 1, scale: 1, transition: { duration: 1 } }, // Scale up and fade in
    exit: { opacity: 0, scale: 0.95, transition: { duration: 1 } }, // Scale down and fade out
  };

  return (
    <section className="relative md:h-[860px] mb-10 md:mb-0 flex justify-center items-center flex-col gap-10 overflow-hidden w-full">
      <AnimatePresence>
        <motion.div
          key={currentImage}
          variants={scaleFadeAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <img
            src={images[currentImage]}
            alt={`Background ${currentImage + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 text-center text-white p-4 bg-opacity-50 flex flex-col justify-center max-w-7xl backdrop-blur-3xl bg-white/10 rounded-lg">
        <h1 className="text-4xl md:text-7xl font-bold uppercase">
          Открий своя стил – една тениска наведнъж!
        </h1>

        <p className="text-white text-md md:text-lg max-w-5xl m-auto">
          Открийте тениски, които съчетават комфорт с креативност. Намерете
          перфектната си кройка и нека стилът ви блести с уникални дизайни.
          Добре дошли в новото ви място за тениски.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
