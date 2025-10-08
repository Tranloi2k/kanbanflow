import { LayoutDashboard, Columns3, ChartLine } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const { projectId } = useParams<{ projectId: string }>()
  const currentPath = location.pathname.split('/').pop() || ''

  const menuItems = [
    {
      id: 'backlog',
      label: 'Backlog',
      icon: LayoutDashboard,
      path: `/project/${projectId}/backlog`,
    },
    {
      id: 'board',
      label: 'Board',
      icon: Columns3,
      path: `/project/${projectId}/board`,
    },
    {
      id: 'report',
      label: 'Report',
      icon: ChartLine,
      path: `/project/${projectId}/report`,
    },
  ]

  const isActive = (itemId: string) => {
    // Handle default route case - when at /project/:id/, show backlog as active
    if (currentPath === projectId && itemId === 'backlog') return true
    return currentPath === itemId
  }

  const getMenuItemClasses = (itemId: string) => {
    const baseClasses =
      'flex items-center gap-3 px-4 hover:bg-blue-50 hover:text-blue-500 rounded'
    const activeClasses = ' !bg-blue-100 !text-blue-500'
    return baseClasses + (isActive(itemId) ? activeClasses : '')
  }

  const MenuItem = ({ item }: { item: (typeof menuItems)[0] }) => {
    const Icon = item.icon

    return (
      <li key={item.id}>
        <Link to={item.path} className={getMenuItemClasses(item.id)}>
          {isActive(item.id) && (
            <div className="absolute left-[13px] h-[16px] w-[5px] bg-blue-500 my-4" />
          )}
          <Icon className="h-[18px] w-[18px]" />
          <span className="block rounded py-2">{item.label}</span>
        </Link>
      </li>
    )
  }

  return (
    <aside className="hidden md:block h-full w-64 flex-shrink-0 bg-gray-50 border-r-1 border-gray-200 text-gray-600 p-3 shadow-xl shadow-gray-100">
      <div className="mb-4 text-2xl font-bold ml-4">
        <Link to="/project" className="hover:text-blue-500">
          KanbanFlow
        </Link>
      </div>

      <div className="text-md font-medium ml-4 mb-2">Planning</div>
      <nav>
        <ul className="font-medium">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
