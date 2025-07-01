"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText, ImageIcon } from "lucide-react"
import type { AnalyticsFilters } from "@/types/analytics"

interface AnalyticsExportProps {
  filters: AnalyticsFilters
}

export function AnalyticsExport({ filters }: AnalyticsExportProps) {
  const handleExport = (format: string) => {
    // In a real implementation, this would trigger an API call to generate the export
    console.log(`Exporting analytics in ${format} format with filters:`, filters)

    // Mock download behavior
    setTimeout(() => {
      alert(`Your ${format.toUpperCase()} export is ready!`)
    }, 1500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("image")}>
          <ImageIcon className="h-4 w-4 mr-2" />
          Export as Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
