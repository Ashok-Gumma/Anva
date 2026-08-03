import { flashcardsData } from "../data/flashcardsData";
import { BookOpen, GraduationCap, Search, ExternalLink, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
};

const FlashcardsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    return flashcardsData.filter(
      (card) =>
        card.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-300/40 min-h-screen">
      <motion.div 
        className="container mx-auto max-w-7xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── TOP HERO BANNER ── */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-base-100 via-base-100 to-base-200/50 p-6 sm:p-8 rounded-[2.5rem] border border-base-content/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <GraduationCap className="size-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">Learning Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              Study Decks & Cheat Sheets
            </h1>
            <p className="text-xs sm:text-sm font-medium text-base-content/60 max-w-xl">
              Master programming concepts, syntax reference sheets, and language manuals with quick PDF guides.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search decks, concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-base-100/90 border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-base-content/30 shadow-inner"
              />
            </div>
          </div>
        </motion.div>

        {/* ── FLASHCARDS GRID ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className="bg-base-100/90 backdrop-blur-md rounded-[2rem] border border-base-content/10 hover:border-primary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between gap-6 group"
            >
              <div className="space-y-4">
                {/* ICON / LOGO BADGE */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-base-200/80 border border-base-content/5 group-hover:scale-105 transition-transform duration-300 shadow-inner shrink-0">
                    <img
                      src={card.logo}
                      alt={card.name}
                      className="size-10 object-contain"
                    />
                  </div>
                  <span className="badge badge-primary/10 text-primary border-primary/20 text-[10px] font-extrabold uppercase tracking-widest px-3 py-2">
                    PDF Guide
                  </span>
                </div>

                {/* CONTENT */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base sm:text-lg text-base-content tracking-tight group-hover:text-primary transition-colors">
                    {card.name}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <a
                href={card.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content hover:brightness-110 shadow-md hover:shadow-primary/20 transition-all cursor-pointer mt-auto"
              >
                <span>Open Reference PDF</span>
                <ExternalLink className="size-4" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlashcardsPage;
