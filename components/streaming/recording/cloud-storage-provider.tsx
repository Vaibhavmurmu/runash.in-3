"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, ExternalLink, Check, AlertTriangle } from "lucide-react"
import Image from "next/image"
import type { CloudStorageProvider } from "@/types/recording"

interface CloudStorageProviderProps {
  provider: CloudStorageProvider
  onConnect: (providerId: string) => void
  onDisconnect: (providerId: string) => void
}

export default function CloudStorageProviderComponent({
  provider,
  onConnect,
  onDisconnect,
}: CloudStorageProviderProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const usagePercentage = (provider.usedSpace / provider.totalSpace) * 100

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <Image
                src={provider.icon || "/placeholder.svg"}
                alt={provider.name}
                fill
                style={{ objectFit: "contain" }}
                className="rounded"
              />
            </div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
          </div>
          {provider.isConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              Disconnected
            </Badge>
          )}
        </div>
        <CardDescription>Cloud storage for your stream recordings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {provider.isConnected && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage Usage</span>
                <span>
                  {formatBytes(provider.usedSpace)} / {formatBytes(provider.totalSpace)}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>

            {usagePercentage > 80 && (
              <div className="flex items-center text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Storage space is running low</span>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {provider.isConnected ? (
          <>
            <Button variant="outline" size="sm" className="text-sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Manage Account
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm text-red-600 hover:text-red-700"
              onClick={() => onDisconnect(provider.id)}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            onClick={() => onConnect(provider.id)}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Connect {provider.name}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
