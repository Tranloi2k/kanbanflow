import { Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-7">
      <div className="flex justify-items-start items-center gap-6">
        <Link to="/" className="text-lg text-gray-700 font-medium">
          <img
            src="/public/KanbanFlow_Logo.png"
            alt="Logo"
            className="h-[30px]"
          />
        </Link>
        <Link to="/project" className="text-lg font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <Rocket className="size-[20px]" />
            <span>Project</span>
          </div>
        </Link>
      </div>
      <div>
        <span className="text-gray-600">Chào, Trần Lợi!</span>
      </div>
    </header>
  )
}

export default Header
