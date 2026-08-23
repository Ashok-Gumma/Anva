import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { NOTION_LOADING_SCENES } from "./loader/LoadingVisuals";

/**
 * Minimalist Notion-Aesthetic Page Loader
 * Clean, distraction-free hand-drawn illustrations that transition immediately
 * with zero box containers or heavy UI clutter.
 */
const PageLoader = ({
  message,
  fullscreen = true,
  className = "",
}) => {
  const { theme } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Immediate & snappy cycling (shifts immediately every 280ms like a sketchbook flipbook)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOTION_LOADING_SCENES.length);
    }, 280);

    return () => clearInterval(timer);
  }, []);

  const currentScene = NOTION_LOADING_SCENES[currentIndex];
  const ActiveComponent = currentScene.Component;

  const containerClasses = fullscreen
    ? "min-h-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf9f6] text-neutral-800 dark:bg-[#141312] dark:text-neutral-200 select-none p-4 transition-colors duration-300"
    : `relative flex flex-col items-center justify-center p-4 text-neutral-800 dark:text-neutral-200 select-none ${className}`;

  return (
    <div className={containerClasses} data-theme={theme}>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* ── Minimalist Aesthetic Illustration (Instant Shift / Stop-Motion Flip) ── */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Minimal Notion-Style Micro Caption ── */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs sm:text-sm font-medium tracking-wide font-sans text-neutral-600 dark:text-neutral-400">
            {message || "loading..."}
          </p>

          {/* Minimal 3-dot pulse indicator */}
          <div className="flex items-center gap-1.5 opacity-40">
            {NOTION_LOADING_SCENES.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? "bg-neutral-800 dark:bg-neutral-200 scale-125 opacity-100"
                    : "bg-neutral-400 dark:bg-neutral-600 opacity-40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
