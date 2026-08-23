import React from "react";
import { motion } from "framer-motion";

/**
 * Aesthetic Notion-Style Hand-Drawn Minimalist Line-Art Illustrations
 * Clean lines (2-2.5px strokes, rounded caps), artistic minimalism,
 * and adaptive theme colors using currentColor.
 */

/**
 * 1. 📖 Notion Aesthetic: Reading & Open Notebook with Quill
 */
export const NotionBookScene = () => (
  <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-800 dark:text-neutral-200">
      {/* Soft warm paper fill on pages */}
      <path
        d="M20 68 C35 62 48 64 50 68 C52 64 65 62 80 68 L80 34 C65 28 52 30 50 34 C48 30 35 28 20 34 Z"
        className="fill-amber-500/10 dark:fill-amber-400/10 stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Book Spine Center line */}
      <line x1="50" y1="34" x2="50" y2="68" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />

      {/* Left Page Lines */}
      <line x1="26" y1="42" x2="42" y2="40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="26" y1="49" x2="40" y2="47" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="26" y1="56" x2="38" y2="54" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

      {/* Right Page Lines */}
      <line x1="58" y1="40" x2="74" y2="42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="60" y1="47" x2="74" y2="49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="62" y1="54" x2="74" y2="56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

      {/* Floating Sparkle / Quill Tip */}
      <motion.path
        d="M50 18 L50 26 M46 22 L54 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="72"
        cy="24"
        r="1.5"
        fill="currentColor"
        animate={{ opacity: [0.2, 0.9, 0.2] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      />
    </svg>
  </div>
);

/**
 * 2. ☕ Notion Aesthetic: Steaming Ceramic Coffee Mug & Succulent Leaf
 */
export const NotionCoffeeScene = () => (
  <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-800 dark:text-neutral-200">
      {/* Delicate Steam Swirls */}
      <motion.path
        d="M38 32 C36 26 42 22 38 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ y: [0, -4, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M48 30 C46 24 52 20 48 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ y: [0, -5, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.6, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mug Body with warm minimal wash fill */}
      <path
        d="M30 38 L62 38 C62 38 60 70 46 70 C32 70 30 38 30 38 Z"
        className="fill-orange-500/10 dark:fill-orange-400/10 stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mug Handle */}
      <path
        d="M58 44 C68 44 68 60 58 60"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Coffee Surface Rim */}
      <ellipse
        cx="46"
        cy="38"
        rx="16"
        ry="4"
        className="fill-neutral-900/15 dark:fill-white/15 stroke-current"
        strokeWidth="2"
      />

      {/* Minimal Plant Leaf on the side */}
      <path
        d="M74 70 C72 58 84 52 84 52 C84 52 86 64 74 70 Z"
        className="fill-emerald-500/15 dark:fill-emerald-400/15 stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="74" y1="70" x2="80" y2="58" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

      {/* Base Coaster line */}
      <line x1="22" y1="74" x2="70" y2="74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * 3. 💡 Notion Aesthetic: Hand-Drawn Idea Lightbulb & Warm Rays
 */
export const NotionIdeaScene = () => (
  <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-800 dark:text-neutral-200">
      {/* Lightbulb glass bulb */}
      <path
        d="M36 44 C36 34 42 26 50 26 C58 26 64 34 64 44 C64 51 60 55 58 60 L42 60 C40 55 36 51 36 44 Z"
        className="fill-yellow-500/15 dark:fill-yellow-400/15 stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Filament Spiral */}
      <path
        d="M46 44 C46 40 50 40 50 44 C50 48 54 48 54 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Screw Base & Contact */}
      <line x1="43" y1="64" x2="57" y2="64" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="45" y1="68" x2="55" y2="68" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M47 72 C47 74 53 74 53 72" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />

      {/* Radiating Idea Rays */}
      <motion.line
        x1="50" y1="16" x2="50" y2="20"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="26" y1="30" x2="30" y2="33"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="74" y1="30" x2="70" y2="33"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="22" y1="46" x2="26" y2="46"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, delay: 0.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="78" y1="46" x2="74" y2="46"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

/**
 * 4. 💻 Notion Aesthetic: Minimal Laptop Desk & Code Brackets
 */
export const NotionDeskScene = () => (
  <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-800 dark:text-neutral-200">
      {/* Laptop Screen */}
      <rect
        x="26"
        y="30"
        width="48"
        height="32"
        rx="3"
        className="fill-sky-500/10 dark:fill-sky-400/10 stroke-current"
        strokeWidth="2.4"
      />

      {/* Screen Inner Code Brackets: { } */}
      <motion.path
        d="M44 42 C41 42 41 44 41 46 C41 48 39 48 39 48 C39 48 41 48 41 50 C41 52 41 54 44 54"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M56 42 C59 42 59 44 59 46 C59 48 61 48 61 48 C61 48 59 48 59 50 C59 52 59 54 56 54"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center dot cursor */}
      <motion.circle
        cx="50"
        cy="48"
        r="1.5"
        fill="currentColor"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />

      {/* Laptop Keyboard Base & Trackpad Notch */}
      <path
        d="M18 64 L82 64 L76 70 L24 70 Z"
        className="fill-neutral-900/10 dark:fill-white/10 stroke-current"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <line x1="45" y1="67" x2="55" y2="67" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      {/* Little Coffee Cup on the desk */}
      <path
        d="M80 56 L86 56 L85 64 L81 64 Z"
        className="fill-amber-500/20 dark:fill-amber-400/20 stroke-current"
        strokeWidth="1.8"
      />
    </svg>
  </div>
);

/**
 * 5. 🪐 Notion Aesthetic: Crescent Moon, Star Sparkles & Paper Plane
 */
export const NotionCosmosScene = () => (
  <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-800 dark:text-neutral-200">
      {/* Hand-drawn Crescent Moon */}
      <path
        d="M48 24 C34 26 24 38 24 52 C24 68 38 80 54 78 C42 74 36 60 40 46 C42 36 46 28 48 24 Z"
        className="fill-indigo-500/10 dark:fill-indigo-400/10 stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Minimal Flying Paper Airplane */}
      <motion.path
        d="M58 40 L78 30 L66 48 L62 43 Z"
        className="fill-neutral-900/15 dark:fill-white/15 stroke-current"
        strokeWidth="2"
        strokeLinejoin="round"
        animate={{ y: [0, -3, 0], x: [0, 2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <line x1="78" y1="30" x2="62" y2="43" stroke="currentColor" strokeWidth="1.8" />

      {/* Star Sparks */}
      <motion.path
        d="M72 58 L72 64 M69 61 L75 61"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="34"
        cy="32"
        r="1.5"
        fill="currentColor"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }}
      />
      <motion.circle
        cx="56"
        cy="72"
        r="1.5"
        fill="currentColor"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 1.2, delay: 0.6, repeat: Infinity }}
      />
    </svg>
  </div>
);

/**
 * Aesthetic Notion-Style Loading Scenes Config
 */
export const NOTION_LOADING_SCENES = [
  {
    id: "notion-book",
    label: "organizing workspace...",
    Component: NotionBookScene,
  },
  {
    id: "notion-coffee",
    label: "brewing thoughts...",
    Component: NotionCoffeeScene,
  },
  {
    id: "notion-idea",
    label: "connecting ideas...",
    Component: NotionIdeaScene,
  },
  {
    id: "notion-desk",
    label: "loading studio...",
    Component: NotionDeskScene,
  },
  {
    id: "notion-cosmos",
    label: "almost ready...",
    Component: NotionCosmosScene,
  },
];
