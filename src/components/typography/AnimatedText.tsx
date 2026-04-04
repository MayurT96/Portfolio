"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnimatedTextProps {
  text: string;
  type?: "heading" | "paragraph" | "hero";
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function AnimatedText({
  text,
  type = "paragraph",
  className,
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === "hero" ? 0.05 : 0.1,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: type === "heading" ? 20 : 0 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom Quart.out
      },
    },
  };

  if (type === "hero") {
    const words = text.split(" ");
    
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={cn("flex flex-wrap", className)}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            className="mr-[0.25em] inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={itemVariants}
      transition={{ delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
