import { ArrowUpRight, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ResearchPaperProps {
  title: string
  authors: string[]
  date: string
  conference: string
  abstract: string
  link: string
  tags: string[]
}

export default function ResearchPaper({ title, authors, date, conference, abstract, link, tags }: ResearchPaperProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-orange-100 dark:border-orange-900/20 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 dark:from-orange-500/30 dark:to-yellow-500/30">
          <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {authors.join(", ")} • {date} • {conference}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{abstract}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-400"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950"
            >
              Read Paper <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-orange-950"
            >
              Download PDF <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
