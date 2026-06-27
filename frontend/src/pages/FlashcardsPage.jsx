import { flashcardsData } from "../data/flashcardsData";
import { BookOpen } from "lucide-react";

const FlashcardsPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-300 min-h-screen">
      <div className="container mx-auto">
        <div className="ide-panel rounded-2xl shadow-sm">
          <div className="ide-panel-header">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <span>Study Deck & Reference Manuals</span>
              <span className="badge badge-sm font-extrabold bg-primary/10 text-primary border-none">
                {flashcardsData.length} Decks
              </span>
            </div>
          </div>

          <div className="ide-panel-body bg-base-100/40">
            {/* FLASHCARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardsData.map((card) => (
                <div
                  key={card.id}
                  className="bg-base-100 rounded-2xl border border-base-content/10 hover:border-primary/30 hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-4">
                    {/* LOGO */}
                    <div className="p-2 rounded-xl bg-base-200 border border-base-content/5 inline-block shrink-0">
                      <img
                        src={card.logo}
                        alt={card.name}
                        className="size-10 object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* CONTENT */}
                    <div>
                      <h3 className="font-bold text-sm text-base-content tracking-tight">{card.name}</h3>
                      <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}
                  <a
                    href={card.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full font-black uppercase tracking-wider text-[10px]"
                  >
                    Open PDF Reference
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
