export default function TariffSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border-4 border-black bg-white animate-pulse"
        >
          <div className="border-b-4 border-black p-4">
            <div className="h-4 bg-gray-200 w-32 mb-2" />
            <div className="h-3 bg-gray-100 w-48" />
          </div>
          <div className="p-4 bg-gray-900">
            <div className="h-8 bg-gray-700 w-24 mb-1" />
            <div className="h-3 bg-gray-700 w-16" />
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 w-16" />
              <div className="h-5 bg-gray-200 w-20" />
              <div className="h-5 bg-gray-200 w-14" />
            </div>
          </div>
          <div className="p-4 border-t-4 border-black">
            <div className="h-12 bg-gray-200 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
