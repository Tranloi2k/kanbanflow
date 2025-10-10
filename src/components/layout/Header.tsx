import { Rocket, User, LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLogout } from '../../hooks/useAuth'

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user } = useAuth()
  const logoutMutation = useLogout()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-7">
      <div className="flex justify-items-start items-center gap-6">
        <Link to="/" className="text-lg text-gray-700 font-medium">
          <img src="/KanbanFlow_Logo.png" alt="Logo" className="h-[30px]" />
        </Link>
        <Link
          to="/projects"
          className="text-lg font-medium text-gray-500 hover:text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Rocket className="size-[20px]" />
            <span>Projects</span>
          </div>
        </Link>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-sm font-medium">
            {user?.fullName || 'User'}
          </span>
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowUserMenu(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            <div className="border-t my-1"></div>

            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>
                {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
