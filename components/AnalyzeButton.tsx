"use client";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function AnalyzeButton({
  onClick,
  disabled,
  loading,
}: AnalyzeButtonProps) {
  return (
    <div className="flex justify-center my-8">
      <button
        id="analyze-button"
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="group relative inline-flex items-center gap-3
          px-8 py-4 rounded-2xl
          text-base font-semibold text-white
          bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
          shadow-lg shadow-indigo-500/25
          hover:shadow-xl hover:shadow-indigo-500/40
          hover:scale-[1.02]
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:scale-100 disabled:hover:shadow-lg
          transition-all duration-200
          overflow-hidden"
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 -translate-x-full
            group-hover:translate-x-full
            transition-transform duration-700
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            pointer-events-none"
        />

        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Analyzing…</span>
          </>
        ) : (
          <>
            <span className="text-xl">✨</span>
            <span>Analyze Match</span>
          </>
        )}
      </button>
    </div>
  );
}
