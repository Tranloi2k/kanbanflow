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
  Settings,
  Star,
  Clock,
  MoreHorizontal,
} from 'lucide-react'
import CreateProjectPopup, { type CreateProjectFormData } from './createPopup'
import ProjectAvatar from '../../components/common/ProjectAvatar'
import { useProjects, useCreateProject } from '../../hooks/useProjects'
import { useAuth } from '../../contexts/AuthContext'
import type { Project, CreateProjectRequest } from '../../types/api'

// Sample data (for fallback when API is not available)
const sampleProjects: Partial<Project>[] = [
  {
    id: '1',
    name: 'Website Redesign',
    key: 'WEB',
    description: 'Complete redesign of the company website with modern UI/UX',
    category: 'design',
    template: 'kanban',
    lead: 'John Doe',
    members: 5,
    issues: 23,
    createdAt: '2024-01-15',
    lastActivity: '2 hours ago',
    starred: true,
  },
  {
    id: '2',
    name: 'Mobile Application',
    key: 'MOB',
    description: 'Native mobile app for iOS and Android platforms',
    category: 'software',
    template: 'scrum',
    lead: 'Jane Smith',
    members: 8,
    issues: 45,
    createdAt: '2024-02-01',
    lastActivity: '1 day ago',
    starred: false,
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    key: 'MARK',
    description: 'Q4 digital marketing campaign for product launch',
    category: 'marketing',
    template: 'kanban',
    lead: 'Bob Wilson',
    members: 3,
    issues: 12,
    createdAt: '2024-03-10',
    lastActivity: '3 hours ago',
    starred: true,
  },
  {
    id: '4',
    name: 'API Development',
    key: 'API',
    description: 'RESTful API development for microservices architecture',
    category: 'software',
    template: 'scrum',
    lead: 'Alice Johnson',
    members: 6,
    issues: 34,
    createdAt: '2024-01-20',
    lastActivity: '5 minutes ago',
    starred: false,
  },
]

const ListProject = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  // Filter and search logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' || project.category === filterCategory
    const matchesStarred = !showStarredOnly || project.starred

    return matchesSearch && matchesCategory && matchesStarred
  })

  const handleCreateProject = (data: CreateProjectFormData) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.name,
      key: data.key,
      description: data.description,
      category: data.category,
      template: data.template as 'kanban' | 'scrum',
      lead: 'Current User',
      members: 1,
      issues: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
      starred: false,
    }
    setProjects([newProject, ...projects])
  }

  const toggleStar = (projectId: string) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, starred: !project.starred }
          : project
      )
    )
  }

  const getProjectAvatar = (project: Project) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
    ]
    const colorIndex = project.id.charCodeAt(0) % colors.length
    return colors[colorIndex]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'software':
        return '💻'
      case 'design':
        return '🎨'
      case 'marketing':
        return '📢'
      case 'business':
        return '💼'
      default:
        return '📋'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className=" flex flex-col ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your work across projects
              </p>
            </div>
            <button
              onClick={() => setIsCreatePopupOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create project
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All categories</option>
                  <option value="software">Software</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {/* Starred Filter */}
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  showStarredOnly
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star
                  className={`h-4 w-4 ${showStarredOnly ? 'fill-current' : ''}`}
                />
                Starred
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ProjectAvatar name={project.key} id={project.id} />
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {project.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {getCategoryIcon(project.category)} {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStar(project.id)}
                      className={`p-1 hover:bg-gray-100 rounded ${
                        project.starred ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${project.starred ? 'fill-current' : ''}`}
                      />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Project Description */}
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Project Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-3 w-3" />
                      {project.members} members
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {project.issues} issues
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Updated {project.lastActivity}
                  </div>
                </div>

                {/* Project Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/project/${project.id}/backlog`}
                    className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open project
                  </Link>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Lead
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Template
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Members
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Issues
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Last Activity
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleStar(project.id)}
                            className={`${
                              project.starred
                                ? 'text-yellow-500'
                                : 'text-gray-400'
                            } hover:text-yellow-500`}
                          >
                            <Star
                              className={`h-4 w-4 ${project.starred ? 'fill-current' : ''}`}
                            />
                          </button>
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${getProjectAvatar(project)}`}
                          >
                            {project.key}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {project.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.key}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {project.lead}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {project.template}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {project.members}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {project.issues}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {project.lastActivity}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/project/${project.id}/backlog`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Open
                          </Link>
                          <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' || showStarredOnly
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first project.'}
              </p>
              {!searchTerm && filterCategory === 'all' && !showStarredOnly && (
                <button
                  onClick={() => setIsCreatePopupOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create your first project
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Project Popup */}
      <CreateProjectPopup
        isOpen={isCreatePopupOpen}
        onClose={() => setIsCreatePopupOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}

export default ListProject
