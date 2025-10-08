import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Trash2,
  Edit,
  Archive,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  Circle,
  Clock,
} from 'lucide-react'
import CreateIssuePopup, { type CreateIssueFormData } from './CreateIssuePopup'
import { useIssues } from '../../../hooks/useIssues'

// Types
interface BacklogItem {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
  assignee?: string
  reporter: string
  storyPoints: number
  labels: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
}

// Sample data
// const sampleBacklogItems: BacklogItem[] = [
//   {
//     id: 'TASK-001',
//     title: 'Design user authentication flow',
//     description:
//       'Create wireframes and mockups for login, register, and password reset flows',
//     priority: 'high',
//     status: 'todo',
//     assignee: 'John Doe',
//     reporter: 'Product Manager',
//     storyPoints: 8,
//     labels: ['UI/UX', 'Authentication'],
//     dueDate: '2024-10-15',
//     createdAt: '2024-10-01',
//     updatedAt: '2024-10-05',
//   },
//   {
//     id: 'TASK-002',
//     title: 'Implement JWT authentication',
//     description:
//       'Set up JWT tokens for secure authentication and session management',
//     priority: 'high',
//     status: 'in-progress',
//     assignee: 'Jane Smith',
//     reporter: 'Tech Lead',
//     storyPoints: 13,
//     labels: ['Backend', 'Security'],
//     dueDate: '2024-10-12',
//     createdAt: '2024-09-28',
//     updatedAt: '2024-10-06',
//   },
//   {
//     id: 'TASK-003',
//     title: 'Create database schema',
//     description:
//       'Design and implement database tables for user management and project data',
//     priority: 'medium',
//     status: 'todo',
//     assignee: 'Bob Wilson',
//     reporter: 'Tech Lead',
//     storyPoints: 5,
//     labels: ['Database', 'Backend'],
//     dueDate: '2024-10-20',
//     createdAt: '2024-10-02',
//     updatedAt: '2024-10-03',
//   },
//   {
//     id: 'TASK-004',
//     title: 'Setup CI/CD pipeline',
//     description: 'Configure automated testing and deployment pipeline',
//     priority: 'medium',
//     status: 'todo',
//     assignee: 'Alice Johnson',
//     reporter: 'DevOps Lead',
//     storyPoints: 8,
//     labels: ['DevOps', 'Infrastructure'],
//     dueDate: '2024-10-25',
//     createdAt: '2024-10-03',
//     updatedAt: '2024-10-04',
//   },
//   {
//     id: 'TASK-005',
//     title: 'Write API documentation',
//     description: 'Document all REST API endpoints with examples and usage',
//     priority: 'low',
//     status: 'done',
//     assignee: 'John Doe',
//     reporter: 'Tech Lead',
//     storyPoints: 3,
//     labels: ['Documentation', 'API'],
//     dueDate: '2024-10-10',
//     createdAt: '2024-09-25',
//     updatedAt: '2024-10-07',
//   },
// ]

export default function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>()
  console.log(projectId)
  const { data: issuesList = [], isLoading } = useIssues(projectId)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)

  // Filter logic
  const filteredItems = issuesList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (item.status && item.status.name === filterStatus)
    const matchesPriority =
      filterPriority === 'all' || item.priority === filterPriority
    const matchesAssignee =
      filterAssignee === 'all' || item.assignee?.id === filterAssignee

    console.log(matchesSearch)
    console.log(matchesStatus)
    console.log(matchesPriority)
    console.log(matchesAssignee)
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    setSelectedItems(
      selectedItems.length === filteredItems.length
        ? []
        : filteredItems.map((item) => item.id)
    )
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="h-4 w-4 text-red-500" />
      case 'medium':
        return <Minus className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <ArrowDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'todo':
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const updateItemStatus = (
    itemId: string,
    newStatus: BacklogItem['status']
  ) => {
    console.log('Update status', itemId, newStatus)
    // setBacklogItems((items) =>
    //   items.map((item) =>
    //     item.id === itemId
    //       ? {
    //           ...item,
    //           status: newStatus,
    //           updatedAt: new Date().toISOString().split('T')[0],
    //         }
    //       : item
    //   )
    // )
  }

  const deleteItem = (itemId: string) => {
    // setBacklogItems((items) => items.filter((item) => item.id !== itemId))
    setSelectedItems((prev) => prev.filter((id) => id !== itemId))
  }

  const addNewItem = () => {
    setIsCreatePopupOpen(true)
  }

  const handleCreateIssue = (data: CreateIssueFormData) => {
    const newItem: BacklogItem = {
      id: '12',
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      status: 'todo',
      assignee: data.assignee || undefined,
      reporter: data.reporter,
      storyPoints: data.storyPoints,
      labels: data.labels || [],
      dueDate: data.dueDate || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    console.log('Create issue', newItem)
    // setBacklogItems([newItem, ...backlogItems])
  }

  const uniqueAssignees = Array.from(
    new Set(issuesList.map((item) => item.assignee).filter(Boolean))
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 w-full min-h-screen">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Backlog</h1>
              <p className="text-gray-600 mt-1">
                Manage and prioritize your project tasks for Project {projectId}
              </p>
            </div>
            <button
              onClick={addNewItem}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create issue
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
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={filterAssignee}
                  onChange={(e) => setFilterAssignee(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All assignees</option>
                  {uniqueAssignees.map((assignee) => (
                    <option key={assignee?.id} value={assignee?.id}>
                      {assignee?.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredItems.length} of {issuesList.length} issues
            {selectedItems.length > 0 && (
              <span className="ml-2 text-blue-600">
                ({selectedItems.length} selected)
              </span>
            )}
          </p>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-lg">
                <Archive className="h-4 w-4 inline mr-1" />
                Archive
              </button>
              <button className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-lg">
                <Trash2 className="h-4 w-4 inline mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Backlog Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 py-3 px-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredItems.length &&
                        filteredItems.length > 0
                      }
                      onChange={selectAllItems}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Issue
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Assignee
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Story Points
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Due Date
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {issuesList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-500">
                            {item.id}
                          </span>
                          {/* TODO: fix labels after backend update */}
                          {item.labels?.map((label) => (
                            <span
                              key={label.id}
                              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                            >
                              {label.name}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {item.issueType}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateItemStatus(
                              item.id,
                              e.target.value as BacklogItem['status']
                            )
                          }
                          className="text-sm border-none bg-transparent focus:outline-none capitalize"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(item.priority)}
                        <span
                          className={`px-2 py-1 text-xs rounded-full border capitalize ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {item.assignee ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                              {item.assignee.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <span className="text-sm text-gray-900">
                              {item.assignee.fullName}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Unassigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {item.storyPoints} pts
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {item.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No issues found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                filterStatus !== 'all' ||
                filterPriority !== 'all' ||
                filterAssignee !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first issue.'}
              </p>
              {!searchTerm &&
                filterStatus === 'all' &&
                filterPriority === 'all' &&
                filterAssignee === 'all' && (
                  <button
                    onClick={addNewItem}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first issue
                  </button>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Create Issue Popup */}
      <CreateIssuePopup
        isOpen={isCreatePopupOpen}
        onClose={() => setIsCreatePopupOpen(false)}
        onSubmit={handleCreateIssue}
      />
    </div>
  )
}
