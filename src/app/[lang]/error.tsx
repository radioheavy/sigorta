"use client";

import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="border-4 border-red-600 p-12 bg-white">
        <p className="text-6xl font-black text-red-600 mb-4">ERROR</p>
        <div className="border-t-4 border-red-600 pt-6 mt-6">
          <h1 className="text-xl font-bold uppercase tracking-wider mb-2">
            Something went wrong
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Please try again or return to the home page.
          </p>
          <Button variant="accent" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
