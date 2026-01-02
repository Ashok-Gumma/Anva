const FlashcardCard = ({ card }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-shadow">
      <div className="card-body p-5 space-y-3">
        <h3 className="text-lg font-bold">{card.name}</h3>

        <p className="text-sm opacity-70">{card.description}</p>

        <a
          href={card.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm w-full"
        >
          Open PDF
        </a>
      </div>
    </div>
  );
};

export default FlashcardCard;
