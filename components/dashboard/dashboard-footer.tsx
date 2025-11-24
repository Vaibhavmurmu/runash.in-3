import { cn } from "@/lib/utils"
import { Link } from "@nextui-org/react"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"

interface DashboardFooterProps {
  className?: string
}

export function DashboardFooter({ className }: DashboardFooterProps) {
  return (
    <footer
      className={cn(
        "w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg">RunAsh.AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Real-time live analytics 
            </p>
             // Empowering creators with AI-powered streaming and analytics tools for the next generation of content
              creation.
            
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:contact@runash.ai"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Status</h3>
            <div className="space-y-2">
              <Link
                href="/status"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Status 
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
              <Link href="/api" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">API</h3>
            <div className="space-y-2">
              <Link
                href="/api"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Help</h3>
            <div className="space-y-2">
              <Link
                href="/help"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Help center 
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} RunAsh.AI. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
