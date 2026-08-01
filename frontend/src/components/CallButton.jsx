import { Video } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button
      onClick={handleVideoCall}
      className="px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-content border border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer text-xs font-bold shrink-0"
      title="Start Video Call"
    >
      <Video className="size-4" />
      <span className="hidden sm:inline">Start Call</span>
    </button>
  );
}

export default CallButton;
