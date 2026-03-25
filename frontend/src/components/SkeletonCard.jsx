/**
 * Shimmer skeleton card — reusable loading placeholder
 */
const SkeletonCard = ({ lines = 3, hasAvatar = true, height = "h-48" }) => {
  return (
    <div className={`bg-base-100 rounded-[2rem] border border-base-content/10 p-6 ${height} overflow-hidden relative`}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-base-content/5 to-transparent" />
      
      {hasAvatar && (
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-base-300 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-300 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-base-300 rounded-full w-1/2 animate-pulse" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-base-300 rounded-full animate-pulse"
            style={{ width: `${90 - i * 15}%` }}
          />
        ))}
      </div>

      <div className="mt-5 h-10 bg-base-300 rounded-xl animate-pulse" />
    </div>
  );
};

export default SkeletonCard;
