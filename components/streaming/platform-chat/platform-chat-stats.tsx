import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatStatistics, StreamingPlatform } from "@/types/platform-chat"
import { getPlatformColor, getPlatformIcon, getPlatformName } from "./platform-utils"

interface PlatformChatStatsProps {
  statistics: ChatStatistics[]
  platform?: StreamingPlatform
}

export default function PlatformChatStats({ statistics, platform }: PlatformChatStatsProps) {
  // Filter statistics by platform if specified
  const filteredStats = platform ? statistics.filter((stat) => stat.platform === platform) : statistics

  // Calculate totals
  const totalMessages = filteredStats.reduce((sum, stat) => sum + stat.messageCount, 0)
  const totalUsers = filteredStats.reduce((sum, stat) => sum + stat.userCount, 0)
  const totalNewUsers = filteredStats.reduce((sum, stat) => sum + stat.newUserCount, 0)
  const averageEngagement =
    filteredStats.length > 0 ? filteredStats.reduce((sum, stat) => sum + stat.engagement, 0) / filteredStats.length : 0

  // Get top chatters across all platforms
  const allTopChatters = filteredStats.flatMap((stat) =>
    stat.topChatters.map((chatter) => ({
      ...chatter,
      platform: stat.platform,
    })),
  )

  // Sort by message count and take top 5
  const topChatters = allTopChatters.sort((a, b) => b.messageCount - a.messageCount).slice(0, 5)

  if (filteredStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400">No statistics available</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Statistics will appear when chat activity begins
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Messages</div>
            <div className="text-2xl font-bold">{totalMessages}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">Active Users</div>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">New Users</div>
            <div className="text-2xl font-bold">{totalNewUsers}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
            <div className="text-2xl font-bold">{Math.round(averageEngagement)}%</div>
          </div>
        </div>

        {filteredStats.length > 1 && (
          <div>
            <h4 className="text-xs font-medium mb-2">Platform Breakdown</h4>
            <div className="space-y-2">
              {filteredStats.map((stat) => {
                const PlatformIcon = getPlatformIcon(stat.platform)
                const platformColor = getPlatformColor(stat.platform)
                const percentage = totalMessages > 0 ? Math.round((stat.messageCount / totalMessages) * 100) : 0

                return (
                  <div key={stat.platform} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <PlatformIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{getPlatformName(stat.platform)}</span>
                      </div>
                      <span className="text-sm">{stat.messageCount} messages</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: platformColor,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{stat.userCount} users</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-medium mb-2">Top Chatters</h4>
          <div className="space-y-1">
            {topChatters.map((chatter, index) => {
              const PlatformIcon = getPlatformIcon(chatter.platform)

              return (
                <div
                  key={`${chatter.username}-${index}`}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 w-5 text-center">{index + 1}.</span>
                    <PlatformIcon className="h-3 w-3 mx-1" />
                    <span className="text-sm">{chatter.username}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{chatter.messageCount} messages</span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Message Rate</h4>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-end justify-between">
              {filteredStats.map((stat, index) => {
                const height = Math.max(10, (stat.messageRate / 30) * 100)
                const PlatformIcon = getPlatformIcon(stat.platform)
                const platformColor = getPlatformColor(stat.platform)

                return (
                  <div key={stat.platform} className="flex flex-col items-center">
                    <div
                      className="w-4 rounded-t"
                      style={{
                        height: `${height}px`,
                        backgroundColor: platformColor,
                      }}
                    ></div>
                    <PlatformIcon className="h-4 w-4 mt-1" />
                    <div className="text-xs mt-1">{Math.round(stat.messageRate)}/min</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
