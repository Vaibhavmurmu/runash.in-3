import React from "react"
import DashboardSettingsDialog from "./dashboard-settings"

export default {
  title: "Components/Dashboard/SettingsDialog",
  component: DashboardSettingsDialog,
}

export const Default = () => <DashboardSettingsDialog />
export const WithUser = () => <DashboardSettingsDialog userId="test-user-123" />
