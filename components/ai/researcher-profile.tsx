import { Award, BookOpen, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

interface ResearcherProfileProps {
  name: string
  role: string
  image: string
  bio: string
  publications: number
  citations: number
  links: {
    linkedin?: string
    twitter?: string
    googleScholar?: string
  }
}

export default function ResearcherProfile({
  name,
  role,
  image,
  bio,
  publications,
  citations,
  links,
}: ResearcherProfileProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-5px]">
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/50 via-yellow-500/50 to-orange-500/50 dark:from-orange-500/30 dark:via-yellow-500/30 dark:to-orange-500/30 rounded-xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative bg-white dark:bg-gray-900 backdrop-blur-sm rounded-xl border border-orange-200/50 dark:border-orange-800/30 transition-colors duration-300 h-full shadow-lg shadow-orange-500/5 group-hover:shadow-orange-500/10 overflow-hidden">
        {/* Researcher image */}
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Social links */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {links.linkedin && (
              <Link
                href={links.linkedin}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </Link>
            )}
            {links.twitter && (
              <Link
                href={links.twitter}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
              >
                <Twitter className="h-4 w-4 text-white" />
              </Link>
            )}
            {links.googleScholar && (
              <Link
                href={links.googleScholar}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-white" />
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{name}</h3>
          <p className="text-orange-600 dark:text-orange-400 font-medium mb-4">{role}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{bio}</p>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{publications} Publications</span>
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{citations} Citations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
