"use client"

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="p-6 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 animate-pulse">
          <div className="h-6 w-3/5 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
