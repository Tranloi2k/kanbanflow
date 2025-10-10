import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar, User, Flag, Tag } from 'lucide-react'

// Zod schema for form validation
const createIssueSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  priority: z.enum(['high', 'medium', 'low']),
  assigneeId: z.string().optional(),
  reporterId: z.string().min(1, 'Reporter is required'),
  storyPoints: z
    .number()
    .min(0, 'Story points must be 0 or greater')
    .max(100, 'Story points must be 100 or less'),
  labels: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
})

export type CreateIssueFormData = z.infer<typeof createIssueSchema>

interface CreateIssuePopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateIssueFormData) => void
}

const CreateIssuePopup = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateIssuePopupProps) => {
  const [newLabel, setNewLabel] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateIssueFormData>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      priority: 'medium',
      storyPoints: 0,
      labels: [],
      reporterId: 'Current User',
    },
  })

  const watchedLabels = watch('labels') || []

  const handleClose = () => {
    reset()
    setNewLabel('')
    onClose()
  }

  const handleFormSubmit = (data: CreateIssueFormData) => {
    onSubmit(data)
    handleClose()
  }

  const addLabel = () => {
    if (newLabel.trim() && !watchedLabels.includes(newLabel.trim())) {
      setValue('labels', [...watchedLabels, newLabel.trim()])
      setNewLabel('')
    }
  }

  const removeLabel = (labelToRemove: string) => {
    setValue(
      'labels',
      watchedLabels.filter((label) => label !== labelToRemove)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLabel()
    }
  }

  const teamMembers = [
    'John Doe',
    'Jane Smith',
    'Bob Wilson',
    'Alice Johnson',
    'Mike Chen',
    'Sarah Davis',
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Issue</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter issue title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the issue in detail..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Flag className="h-4 w-4 inline mr-1" />
                    Priority *
                  </label>
                  <select
                    {...register('priority')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.priority ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.priority.message}
                    </p>
                  )}
                </div>

                {/* Story Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('storyPoints', { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.storyPoints ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.storyPoints && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.storyPoints.message}
                    </p>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Assignee
                  </label>
                  <select
                    {...register('assigneeId')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.assigneeId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                  {errors.assigneeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assigneeId.message}
                    </p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Labels
                </label>
                <div className="space-y-3">
                  {/* Add Label Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a label..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addLabel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Current Labels */}
                  {watchedLabels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watchedLabels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                        >
                          {label}
                          <button
                            type="button"
                            onClick={() => removeLabel(label)}
                            className="hover:text-blue-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reporter (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter
                </label>
                <input
                  type="text"
                  {...register('reporterId')}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateIssuePopup
