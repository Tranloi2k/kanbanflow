import React from 'react'
import Sidebar from './Sidebar'
import ProjectAvatar from '../../common/ProjectAvatar'

interface DashboardLayoutProps {
  children: React.ReactNode // 'children' là nội dung chính sẽ được hiển thị
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row w-full ">
      <Sidebar />
      <main className="flex flex-col size-full overflow-y-auto">
        <div className="flex justify-between items-center w-full px-6 py-4 bg-white">
          <div className="flex flex-col items-center">
            <span className="w-full">Project</span>
            <div className="flex items-center gap-3 mt-2">
              <ProjectAvatar name="KAN" id="1" />
              <span className="text-2xl font-semibold">Kanban Board</span>
            </div>
          </div>
        </div>
        <div className="flex w-full h-full">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
