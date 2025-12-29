interface TestimonialCardProps {
  name: string
  role: string
  image: string
  quote: string
}

export default function TestimonialCard({ name, role, image, quote }: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 backdrop-blur-sm border border-orange-200 dark:border-orange-800/20 rounded-xl p-6 hover:border-orange-500/50 dark:hover:border-orange-500/30 transition-all duration-300 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 min-w-[300px] md:min-w-[350px] max-w-md flex-shrink-0">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-orange-200 dark:border-orange-800/30">
          <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-orange-600 dark:text-orange-400">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 italic">"{quote}"</p>
    </div>
  )
}
