import { LayoutDashboard, Columns3, ChartLine } from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="hidden md:block h-full w-64 flex-shrink-0 bg-gray-50 border-r-1 border-gray-200 text-gray-600 p-3 shadow-xl shadow-gray-100">
      <div className="mb-4 text-2xl font-bold ">KanbanFlow</div>
      <div className="text-md font-medium">Planning</div>
      <nav>
        <ul className="font-medium">
          <li>
            <div className="flex items-center gap-3 px-4 hover:bg-blue-100 hover:!text-blue-500 rounded">
              <div className="absolute left-[13px] h-[16px] w-[5px] bg-blue-500 my-4"></div>
              <LayoutDashboard className="h-[18px] w-[18px]" />
              <a href="#" className="block rounded py-2 ">
                Dashboard
              </a>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-3 px-4 hover:bg-blue-100 hover:!text-blue-500 rounded">
              <Columns3 className="h-[18px] w-[18px]" />
              <Link to="/project/board" className="block rounded py-2">
                Board
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-3 px-4 hover:bg-blue-100 hover:!text-blue-500 rounded">
              <ChartLine className=" h-[18px] w-[18px]" />
              <Link to="/project/report" className="block rounded py-2">
                Report
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
