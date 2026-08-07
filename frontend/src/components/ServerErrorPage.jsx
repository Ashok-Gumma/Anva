import { useState } from "react";
import { ServerOff, RefreshCw, WifiOff, ShieldAlert, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ServerErrorPage = ({ error, onRetry }) => {
  const queryClient = useQueryClient();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) await onRetry();
      await queryClient.invalidateQueries();
    } catch {
      // handled by query state
    } finally {
      setTimeout(() => setIsRetrying(false), 800);
    }
  };

  const isNetworkOffline = typeof navigator !== "undefined" && !navigator.onLine;
  const statusText = error?.response?.status
    ? `HTTP ${error.response.status} ${error.response.statusText || "Server Error"}`
    : isNetworkOffline
    ? "Internet Disconnected"
    : error?.message || "Connection Refused";

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col items-center justify-center p-4 sm:p-6 font-minimal selection:bg-primary selection:text-primary-content relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-error/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-72 bg-warning/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-lg w-full bg-base-100/90 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-error/20 shadow-2xl text-center space-y-6 relative z-10">
        {/* Status Icon */}
        <div className="size-20 bg-error/10 text-error rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-error/20">
          {isNetworkOffline ? (
            <WifiOff className="size-10 text-error animate-pulse" />
          ) : (
            <ServerOff className="size-10 text-error animate-pulse" />
          )}
        </div>

        {/* Error Badge & Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-error/15 text-error border border-error/30 text-xs font-extrabold uppercase tracking-wider">
            <ShieldAlert className="size-4" />
            <span>{statusText}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Backend Connection Failed
          </h1>

          <p className="text-xs sm:text-sm text-base-content/70 font-medium leading-relaxed max-w-md mx-auto">
            {isNetworkOffline
              ? "Your device appears to be offline. Please check your internet connection and try again."
              : "Unable to communicate with the Anva server. The backend may be temporarily down or undergoing maintenance."}
          </p>
        </div>

        {/* Status Details Box */}
        <div className="p-4 rounded-2xl bg-base-200/60 border border-base-content/10 text-xs font-semibold text-base-content/70 text-left space-y-1 font-mono">
          <div className="text-[10px] text-base-content/40 uppercase tracking-widest font-sans font-bold">Diagnostic Log</div>
          <p className="text-error font-bold truncate">Error: {statusText}</p>
          <p className="text-base-content/60 text-[11px]">Endpoint: /api/v1/auth/me</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-content hover:opacity-90 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Reconnecting..." : "Retry Connection"}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-base-200 text-base-content hover:bg-base-300 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-base-content/10"
          >
            <ArrowLeft className="size-4" /> Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
