import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface DemoCardProps {
  title: string
  description: string
  image: string
  link: string
  gradient: string
  icon: ReactNode
}

export default function DemoCard({ title, description, image, link, gradient, icon }: DemoCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-5px]">
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/50 via-yellow-500/50 to-orange-500/50 dark:from-orange-500/30 dark:via-yellow-500/30 dark:to-orange-500/30 rounded-xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative bg-white dark:bg-gray-900 backdrop-blur-sm rounded-xl border border-orange-200/50 dark:border-orange-800/30 transition-colors duration-300 h-full shadow-lg shadow-orange-500/5 group-hover:shadow-orange-500/10 overflow-hidden">
        {/* Demo image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icon badge */}
          <div className="absolute top-4 left-4">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>{icon}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>

          <Link
            href={link}
            className="inline-flex items-center text-orange-600 dark:text-orange-400 font-medium group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors"
          >
            Try Demo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
