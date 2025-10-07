import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Plus } from 'lucide-react'
import CreateProjectPopup, {
  type CreateProjectFormData,
} from '../../../pages/project/createPopup'

interface DashboardLayoutProps {
  children: React.ReactNode // 'children' là nội dung chính sẽ được hiển thị
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleCreateProject = (data: CreateProjectFormData) => {
    console.log('Creating project with data:', data)
    // Ở đây bạn có thể gọi API để tạo project
    alert(`Project "${data.name}" created successfully!`)
  }
  return (
    <div className="flex flex-row w-full ">
      <Sidebar />
      <main className="flex flex-col size-full overflow-y-auto">
        <div className="flex justify-between items-center w-full px-6 py-4 bg-white">
          <div className="flex flex-col items-center">
            <span className="w-full">Project</span>
            <span className="w-full text-2xl font-semibold">Kanban Board</span>
          </div>
          <button
            onClick={() => setIsPopupOpen(true)}
            className=" flex items-center bg-blue-500 text-white px-4 gap-2 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Plus className="size-[20px]" />
            Create
          </button>
        </div>
        <CreateProjectPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleCreateProject}
        />
        <div className="flex w-full h-full">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
