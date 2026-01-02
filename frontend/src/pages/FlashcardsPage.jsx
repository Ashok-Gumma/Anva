import { flashcardsData } from "../data/flashcardsData";

const FlashcardsPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="opacity-70">
            Learn faster with concise PDF flashcards
          </p>
        </div>

        {/* FLASHCARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardsData.map((card) => (
            <div
              key={card.id}
              className="card bg-base-200 hover:shadow-lg transition"
            >
              <div className="card-body space-y-4">
                {/* LOGO */}
                <img
                  src={card.logo}
                  alt={card.name}
                  className="size-14"
                />

                {/* CONTENT */}
                <div>
                  <h2 className="card-title">{card.name}</h2>
                  <p className="text-sm opacity-70">
                    {card.description}
                  </p>
                </div>

                {/* ACTION */}
                <a
                  href={card.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  Open PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
