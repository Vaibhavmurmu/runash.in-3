interface TechBadgeProps {
  label: string
}

export default function TechBadge({ label }: TechBadgeProps) {
  return (
    <div className="px-4 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-800/30 shadow-sm">
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
    </div>
  )
}
