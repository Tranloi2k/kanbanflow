import { useEffect } from 'react'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '../contexts/AuthContext'

const ApiTest = () => {
  const { user, isAuthenticated } = useAuth()
  const { data: projectsData, isLoading, error } = useProjects()

  useEffect(() => {
    console.log('Auth State:', { user, isAuthenticated })
    console.log('Projects Data:', projectsData)
    console.log('Loading:', isLoading)
    console.log('Error:', error)
  }, [user, isAuthenticated, projectsData, isLoading, error])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Integration Test</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Projects API</h2>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? JSON.stringify(error, null, 2) : 'None'}</p>
          <p>
            Data:{' '}
            {projectsData ? JSON.stringify(projectsData, null, 2) : 'None'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">API Configuration</h2>
          <p>API URL: {import.meta.env.VITE_API_URL}</p>
          <p>Environment: {import.meta.env.VITE_ENV}</p>
        </div>
      </div>
    </div>
  )
}

export default ApiTest
