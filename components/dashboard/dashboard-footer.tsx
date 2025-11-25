import { cn } from "@/lib/utils"
import { Link } from "@nextui-org/react"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DashboardFooterProps {
  className?: string
}

export function DashboardFooter({ className }: DashboardFooterProps) {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-1 text-xs">
        <Separator orientation="vertical" />
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Terms</a>
        
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Privacy</a>
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Security</a>
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Status</a>
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Community</a>
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Docs</a>
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Contact</a>
        <a href="#" className="hover:text-[#c9d1d9] transition-colors">Manage cookies</a>
      </nav>
      <div className="text-xs mb-1">Do not share my personal information</div>
      <div className="flex items-center gap-2 text-xs">
        <Github size={16} className="text-[#b1bac4]" aria-label="GitHub" />
        <span>© 2025 RunAsh AI.</span>
      </div>
      <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} RunAsh.AI. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for creators worldwide</span>
          </div>
        </div>
    </footer>
  )
}



