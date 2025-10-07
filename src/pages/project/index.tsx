import { Outlet } from 'react-router-dom'
import MainLayout from '../../components/layout/dashboardLayout/MainLayout'

export default function ProjectPage() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
