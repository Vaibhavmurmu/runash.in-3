import { neon } from "@neondatabase/serverless"
import { EmailDeliveryTracker } from "./email-delivery"
import { EmailBounceHandler } from "./email-bounce-handler"

const sql = neon(process.env.DATABASE_URL!)

export interface EmailAnalyticsData {
  overview: {
    total_sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
    delivery_rate: number
    open_rate: number
    click_rate: number
    bounce_rate: number
    unsubscribe_rate: number
  }
  trends: {
    daily_stats: Array<{
      date: string
      sent: number
      delivered: number
      opened: number
      clicked: number
      bounced: number
    }>
    hourly_engagement: Array<{
      hour: number
      opens: number
      clicks: number
    }>
  }
  campaigns: Array<{
    id: number
    name: string
    sent_count: number
    delivered_count: number
    opened_count: number
    clicked_count: number
    bounced_count: number
    delivery_rate: number
    open_rate: number
    click_rate: number
    sent_at: Date
  }>
  templates: Array<{
    id: number
    name: string
    usage_count: number
    avg_open_rate: number
    avg_click_rate: number
    last_used: Date
  }>
  top_performing: {
    campaigns: Array<{
      name: string
      open_rate: number
      click_rate: number
    }>
    templates: Array<{
      name: string
      open_rate: number
      click_rate: number
    }>
    subject_lines: Array<{
      subject: string
      open_rate: number
      sent_count: number
    }>
  }
  geographic: Array<{
    country: string
    opens: number
    clicks: number
    unique_recipients: number
  }>
  devices: Array<{
    device_type: string
    opens: number
    clicks: number
    percentage: number
  }>
  bounce_analysis: {
    bounce_types: Array<{
      type: string
      count: number
      percentage: number
    }>
    top_bounce_reasons: Array<{
      reason: string
      count: number
    }>
  }
}

export class EmailAnalytics {
  // Get comprehensive email analytics
  static async getAnalytics(filters: {
    date_from?: Date
    date_to?: Date
    campaign_id?: number
    template_id?: number
  }): Promise<EmailAnalyticsData> {
    try {
      const dateFrom = filters.date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const dateTo = filters.date_to || new Date()

      // Get overview stats
      const overview = await EmailDeliveryTracker.getDeliveryStats(filters)

      // Get unsubscribe count
      const unsubscribeResult = await sql`
        SELECT COUNT(*) as count FROM email_suppressions 
        WHERE type = 'unsubscribe' 
        AND created_at >= ${dateFrom.toISOString()}
        AND created_at <= ${dateTo.toISOString()}
      `
      const unsubscribed = Number.parseInt(unsubscribeResult[0].count)

      // Calculate unsubscribe rate
      const unsubscribe_rate = overview.total_sent > 0 ? (unsubscribed / overview.total_sent) * 100 : 0

      // Get daily trends
      const dailyStats = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as sent,
          COUNT(CASE WHEN status IN ('delivered', 'opened', 'clicked') THEN 1 END) as delivered,
          COUNT(CASE WHEN status IN ('opened', 'clicked') THEN 1 END) as opened,
          COUNT(CASE WHEN status = 'clicked' THEN 1 END) as clicked,
          COUNT(CASE WHEN status = 'bounced' THEN 1 END) as bounced
        FROM email_deliveries 
        WHERE created_at >= ${dateFrom.toISOString()}
        AND created_at <= ${dateTo.toISOString()}
        ${filters.campaign_id ? sql`AND campaign_id = ${filters.campaign_id}` : sql``}
        ${filters.template_id ? sql`AND template_id = ${filters.template_id}` : sql``}
        GROUP BY DATE(created_at)
        ORDER BY date
      `

      // Get hourly engagement patterns
      const hourlyEngagement = await sql`
        SELECT 
          EXTRACT(HOUR FROM opened_at) as hour,
          COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opens,
          COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as clicks
        FROM email_deliveries 
        WHERE created_at >= ${dateFrom.toISOString()}
        AND created_at <= ${dateTo.toISOString()}
        AND (opened_at IS NOT NULL OR clicked_at IS NOT NULL)
        GROUP BY EXTRACT(HOUR FROM opened_at)
        ORDER BY hour
      `

      // Get campaign performance
      const campaigns = await sql`
        SELECT 
          c.id, c.name, c.sent_count, c.delivered_count, c.opened_count, 
          c.clicked_count, c.bounced_count, c.sent_at,
          CASE WHEN c.sent_count > 0 THEN (c.delivered_count::float / c.sent_count * 100) ELSE 0 END as delivery_rate,
          CASE WHEN c.delivered_count > 0 THEN (c.opened_count::float / c.delivered_count * 100) ELSE 0 END as open_rate,
          CASE WHEN c.opened_count > 0 THEN (c.clicked_count::float / c.opened_count * 100) ELSE 0 END as click_rate
        FROM email_campaigns c
        WHERE c.sent_at >= ${dateFrom.toISOString()}
        AND c.sent_at <= ${dateTo.toISOString()}
        ORDER BY c.sent_at DESC
        LIMIT 20
      `

      // Get template performance
      const templates = await sql`
        SELECT 
          t.id, t.name,
          COUNT(d.id) as usage_count,
          AVG(CASE WHEN d.status IN ('opened', 'clicked') THEN 100.0 ELSE 0.0 END) as avg_open_rate,
          AVG(CASE WHEN d.status = 'clicked' THEN 100.0 ELSE 0.0 END) as avg_click_rate,
          MAX(d.created_at) as last_used
        FROM email_templates t
        LEFT JOIN email_deliveries d ON t.id = d.template_id
        WHERE d.created_at >= ${dateFrom.toISOString()}
        AND d.created_at <= ${dateTo.toISOString()}
        GROUP BY t.id, t.name
        HAVING COUNT(d.id) > 0
        ORDER BY usage_count DESC
        LIMIT 10
      `

      // Get top performing campaigns
      const topCampaigns = await sql`
        SELECT 
          c.name,
          CASE WHEN c.delivered_count > 0 THEN (c.opened_count::float / c.delivered_count * 100) ELSE 0 END as open_rate,
          CASE WHEN c.opened_count > 0 THEN (c.clicked_count::float / c.opened_count * 100) ELSE 0 END as click_rate
        FROM email_campaigns c
        WHERE c.sent_at >= ${dateFrom.toISOString()}
        AND c.sent_at <= ${dateTo.toISOString()}
        AND c.delivered_count > 10
        ORDER BY open_rate DESC
        LIMIT 5
      `

      // Get top performing templates
      const topTemplates = await sql`
        SELECT 
          t.name,
          AVG(CASE WHEN d.status IN ('opened', 'clicked') THEN 100.0 ELSE 0.0 END) as open_rate,
          AVG(CASE WHEN d.status = 'clicked' THEN 100.0 ELSE 0.0 END) as click_rate
        FROM email_templates t
        JOIN email_deliveries d ON t.id = d.template_id
        WHERE d.created_at >= ${dateFrom.toISOString()}
        AND d.created_at <= ${dateTo.toISOString()}
        GROUP BY t.id, t.name
        HAVING COUNT(d.id) > 5
        ORDER BY open_rate DESC
        LIMIT 5
      `

      // Get top subject lines
      const topSubjects = await sql`
        SELECT 
          subject,
          COUNT(*) as sent_count,
          AVG(CASE WHEN status IN ('opened', 'clicked') THEN 100.0 ELSE 0.0 END) as open_rate
        FROM email_deliveries
        WHERE created_at >= ${dateFrom.toISOString()}
        AND created_at <= ${dateTo.toISOString()}
        GROUP BY subject
        HAVING COUNT(*) > 5
        ORDER BY open_rate DESC
        LIMIT 5
      `

      // Get bounce analysis
      const bounceStats = await EmailBounceHandler.getBounceStats(filters)

      // Mock geographic and device data (in production, extract from tracking_data)
      const geographic = [
        { country: "United States", opens: 450, clicks: 89, unique_recipients: 320 },
        { country: "United Kingdom", opens: 280, clicks: 52, unique_recipients: 210 },
        { country: "Canada", opens: 180, clicks: 34, unique_recipients: 140 },
        { country: "Australia", opens: 120, clicks: 23, unique_recipients: 95 },
        { country: "Germany", opens: 95, clicks: 18, unique_recipients: 75 },
      ]

      const devices = [
        { device_type: "Mobile", opens: 680, clicks: 145, percentage: 65 },
        { device_type: "Desktop", opens: 320, clicks: 89, percentage: 30 },
        { device_type: "Tablet", opens: 55, clicks: 12, percentage: 5 },
      ]

      return {
        overview: {
          ...overview,
          unsubscribed,
          unsubscribe_rate,
        },
        trends: {
          daily_stats: dailyStats.map((stat) => ({
            date: stat.date,
            sent: Number.parseInt(stat.sent),
            delivered: Number.parseInt(stat.delivered),
            opened: Number.parseInt(stat.opened),
            clicked: Number.parseInt(stat.clicked),
            bounced: Number.parseInt(stat.bounced),
          })),
          hourly_engagement: hourlyEngagement.map((hour) => ({
            hour: Number.parseInt(hour.hour),
            opens: Number.parseInt(hour.opens),
            clicks: Number.parseInt(hour.clicks),
          })),
        },
        campaigns: campaigns.map((campaign) => ({
          ...campaign,
          sent_count: Number.parseInt(campaign.sent_count),
          delivered_count: Number.parseInt(campaign.delivered_count),
          opened_count: Number.parseInt(campaign.opened_count),
          clicked_count: Number.parseInt(campaign.clicked_count),
          bounced_count: Number.parseInt(campaign.bounced_count),
          delivery_rate: Number.parseFloat(campaign.delivery_rate),
          open_rate: Number.parseFloat(campaign.open_rate),
          click_rate: Number.parseFloat(campaign.click_rate),
        })),
        templates: templates.map((template) => ({
          ...template,
          usage_count: Number.parseInt(template.usage_count),
          avg_open_rate: Number.parseFloat(template.avg_open_rate),
          avg_click_rate: Number.parseFloat(template.avg_click_rate),
        })),
        top_performing: {
          campaigns: topCampaigns.map((campaign) => ({
            name: campaign.name,
            open_rate: Number.parseFloat(campaign.open_rate),
            click_rate: Number.parseFloat(campaign.click_rate),
          })),
          templates: topTemplates.map((template) => ({
            name: template.name,
            open_rate: Number.parseFloat(template.open_rate),
            click_rate: Number.parseFloat(template.click_rate),
          })),
          subject_lines: topSubjects.map((subject) => ({
            subject: subject.subject,
            open_rate: Number.parseFloat(subject.open_rate),
            sent_count: Number.parseInt(subject.sent_count),
          })),
        },
        geographic,
        devices,
        bounce_analysis: {
          bounce_types: [
            { type: "Hard Bounce", count: bounceStats.hard_bounces, percentage: 60 },
            { type: "Soft Bounce", count: bounceStats.soft_bounces, percentage: 30 },
            { type: "Complaints", count: bounceStats.complaints, percentage: 10 },
          ],
          top_bounce_reasons: bounceStats.top_bounce_reasons,
        },
      }
    } catch (error) {
      console.error("Error fetching email analytics:", error)
      throw error
    }
  }

  // Get real-time email metrics
  static async getRealTimeMetrics(): Promise<{
    emails_sent_today: number
    current_open_rate: number
    active_campaigns: number
    recent_activity: Array<{
      type: string
      message: string
      timestamp: Date
    }>
  }> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayStats = await sql`
        SELECT 
          COUNT(*) as emails_sent,
          COUNT(CASE WHEN status IN ('opened', 'clicked') THEN 1 END) as opened,
          COUNT(CASE WHEN status = 'clicked' THEN 1 END) as clicked
        FROM email_deliveries 
        WHERE created_at >= ${today.toISOString()}
      `

      const activeCampaigns = await sql`
        SELECT COUNT(*) as count FROM email_campaigns 
        WHERE status = 'sending' OR (status = 'scheduled' AND scheduled_at <= NOW())
      `

      const recentActivity = await sql`
        SELECT 
          'delivery' as type,
          'Email delivered to ' || recipient_email as message,
          delivered_at as timestamp
        FROM email_deliveries 
        WHERE delivered_at IS NOT NULL 
        AND delivered_at >= NOW() - INTERVAL '1 hour'
        ORDER BY delivered_at DESC 
        LIMIT 10
      `

      const stats = todayStats[0]
      const emailsSent = Number.parseInt(stats.emails_sent)
      const opened = Number.parseInt(stats.opened)

      return {
        emails_sent_today: emailsSent,
        current_open_rate: emailsSent > 0 ? (opened / emailsSent) * 100 : 0,
        active_campaigns: Number.parseInt(activeCampaigns[0].count),
        recent_activity: recentActivity.map((activity) => ({
          type: activity.type,
          message: activity.message,
          timestamp: new Date(activity.timestamp),
        })),
      }
    } catch (error) {
      console.error("Error fetching real-time metrics:", error)
      return {
        emails_sent_today: 0,
        current_open_rate: 0,
        active_campaigns: 0,
        recent_activity: [],
      }
    }
  }
}
