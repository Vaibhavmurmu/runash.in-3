"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Check, Link, Mail, Twitter, Facebook, Linkedin, Youtube } from "lucide-react"
import type { RecordedStream } from "@/types/recording"

interface ShareDialogProps {
  stream: RecordedStream | null
  isOpen: boolean
  onClose: () => void
}

export default function ShareDialog({ stream, isOpen, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(stream?.isPublic || false)
  const [activeTab, setActiveTab] = useState("link")

  if (!stream) return null

  const shareUrl = `https://runash.ai/recordings/${stream.id}`
  const embedCode = `<iframe width="560" height="315" src="https://runash.ai/embed/${stream.id}" frameborder="0" allowfullscreen></iframe>`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTogglePublic = () => {
    setIsPublic(!isPublic)
    // In a real app, we would update the stream's public status in the database
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recording</DialogTitle>
          <DialogDescription>Share your recording with others or embed it on your website.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="public-toggle" className="cursor-pointer">
              Make recording public
            </Label>
            <Switch id="public-toggle" checked={isPublic} onCheckedChange={handleTogglePublic} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(shareUrl)}
                className={copied ? "text-green-500" : ""}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-center space-x-4 pt-2">
              <Button variant="outline" size="icon" className="rounded-full" title="Share via link">
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" title="Share via email">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" title="Share on Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" title="Share on Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" title="Share on LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" title="Share on YouTube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="embed" className="space-y-4 mt-4">
            <div className="flex space-x-2">
              <Input value={embedCode} readOnly className="flex-1 font-mono text-xs" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(embedCode)}
                className={copied ? "text-green-500" : ""}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="border rounded p-4 bg-gray-50 dark:bg-gray-900">
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-sm text-gray-500">Embed Preview</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
