import { Grid } from "@mui/material"
import { TurnServerMonitor } from "./turn-server-monitor"

const MultiHostDashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* Dashboard Header */}
        <h2>Multi-Host Streaming Dashboard</h2>
      </Grid>

      <Grid item xs={12} md={6}>
        {/* Stream Status */}
        <div>
          <h3>Stream Status</h3>
          {/* Add stream status components here */}
        </div>
      </Grid>

      <Grid item xs={12} md={6}>
        {/* Server Statistics */}
        <div>
          <h3>Server Statistics</h3>
          {/* Add server statistics components here */}
          <TurnServerMonitor />
        </div>
      </Grid>

      <Grid item xs={12}>
        {/* User Activity */}
        <div>
          <h3>User Activity</h3>
          {/* Add user activity components here */}
        </div>
      </Grid>
    </Grid>
  )
}

export default MultiHostDashboard
