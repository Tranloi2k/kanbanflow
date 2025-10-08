import { Outlet } from 'react-router-dom'
import DashboardLayout from '../../components/layout/dashboardLayout/DashboardLayout'

export default function ProjectDashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
