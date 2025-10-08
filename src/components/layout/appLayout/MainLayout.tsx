import React from 'react'
import Header from '../Header'
interface MainLayoutProps {
  children: React.ReactNode // 'children' là nội dung chính sẽ được hiển thị
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-white">
      <Header />
      <div className="flex flex-row h-[calc(100vh-4rem)]">
        <main className="flex size-full overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
