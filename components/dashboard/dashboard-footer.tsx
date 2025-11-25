"use client";

import { Github } from "lucide-react"; // or use shadcn/ui icon

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D1117] text-[#8b949e] py-8 flex flex-col items-center">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-1 text-xs">
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
        <span>© 2025 GitHub, Inc.</span>
      </div>
    </footer>
  );
}
