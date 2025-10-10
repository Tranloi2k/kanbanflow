import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Users,
  Star,
  Clock,
  MoreHorizontal,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import CreateProjectPopup, { type CreateProjectFormData } from './createPopup'
import ProjectAvatar from '../../components/common/ProjectAvatar'
import { useProjects, useCreateProject } from '../../hooks/useProjects'
import type { Project } from '../../types/api'

const ListProject = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)

  const {
    data: projectsResponse,
    isLoading,
    error,
    refetch,
  } = useProjects({
    search: searchTerm || undefined,
    // type: filterCategory !== 'all' ? filterCategory.toUpperCase() : undefined, // Removed to match ProjectQueryParams type
  })
  const createProjectMutation = useCreateProject()

  const projects = projectsResponse?.data || []

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' ||
      project.category.toLowerCase() === filterCategory

    // TODO: Add starred functionality when API supports it
    const matchesStarred = !showStarredOnly || true

    return matchesSearch && matchesCategory && matchesStarred
  })

  const handleCreateProject = async (data: CreateProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync({
        name: data.name,
        description: data.description,
        key: data.key,
        category: data.category.toUpperCase() as
          | 'SOFTWARE'
          | 'BUSINESS'
          | 'MARKETING',
        template: data.template.toUpperCase() as
          | 'KANBAN'
          | 'SCRUM'
          | 'BUG_TRACKING',
      })
      setIsCreatePopupOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const toggleStar = (projectId: string) => {
    // TODO: Implement star/unstar API call when available
    console.log('Toggle starred for project:', projectId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading projects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load projects
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error loading your projects. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex flex-col mx-auto p-6">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage and track your projects
              </p>
            </div>
            <button
              onClick={() => setIsCreatePopupOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="software">Software</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              {/* Starred Filter */}
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  showStarredOnly
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Star
                  className={`h-4 w-4 ${showStarredOnly ? 'fill-current' : ''}`}
                />
                <span>Starred</span>
              </button>

              {/* View Mode */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterCategory !== 'all' || showStarredOnly
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first project.'}
              </p>
              {!searchTerm && filterCategory === 'all' && !showStarredOnly && (
                <button
                  onClick={() => setIsCreatePopupOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Project
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProjects.map((project: Project) => (
              <div
                key={project.id}
                className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'p-4' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <ProjectAvatar name={project.name} size="md" />
                        <div>
                          <Link
                            to={`/project/${project.id}/board`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {project.name}
                          </Link>
                          <p className="text-sm text-gray-500">{project.key}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStar(project.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{project.members?.length ?? 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>0 issues</span> {/* TODO: Add issues count */}
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {project.template}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          Updated {formatDate(project.updatedAt ?? '')}
                        </span>
                      </div>
                      <Link
                        to={`/project/${project.id}/board`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Open →
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <ProjectAvatar name={project.name} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/project/${project.id}/board`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {project.name}
                          </Link>
                          <span className="text-sm text-gray-500">
                            {project.key}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {project.template}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{project.members?.length ?? 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>0 issues</span>
                      </div>
                      <span>Updated {formatDate(project.updatedAt ?? '')}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStar(project.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Project Popup */}
        <CreateProjectPopup
          isOpen={isCreatePopupOpen}
          onClose={() => setIsCreatePopupOpen(false)}
          onSubmit={handleCreateProject}
          //  isLoading={createProjectMutation.isPending}
        />
      </div>
    </div>
  )
}

export default ListProject
