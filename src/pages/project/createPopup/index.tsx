import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar, FolderOpen } from 'lucide-react'

// Zod schema for form validation
const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters'),
  key: z
    .string()
    .min(1, 'Project key is required')
    .min(2, 'Project key must be at least 2 characters')
    .max(10, 'Project key must be less than 10 characters')
    .regex(/^[A-Z]+$/, 'Project key must contain only uppercase letters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  lead: z.string().min(1, 'Project lead is required'),
  category: z.string().min(1, 'Project category is required'),
  template: z.string().min(1, 'Project template is required'),
})

export type CreateProjectFormData = z.infer<typeof createProjectSchema>

interface CreateProjectPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectFormData) => void
}

const CreateProjectPopup = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectPopupProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      template: 'kanban',
      category: 'software',
      lead: 'current-user',
    },
  })

  const watchedKey = watch('key')

  // Auto-generate project key from name
  const generateKey = (name: string) => {
    const key = name
      .toUpperCase()
      .replace(/[^A-Z\s]/g, '')
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 10)
    setValue('key', key)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (name && !watchedKey) {
      generateKey(name)
    }
  }

  const handleClose = () => {
    reset()
    setCurrentStep(1)
    onClose()
  }

  const handleFormSubmit = (data: CreateProjectFormData) => {
    onSubmit(data)
    handleClose()
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create project
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between space-x-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-24 h-0.5 ml-18 ${
                      index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Choose template</span>
            <span>Project details</span>
            <span>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 min-h-[400px]">
            {/* Step 1: Choose Template */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Choose a project template
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Templates help you get started with best practices for your
                    project type.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'kanban',
                      name: 'Kanban',
                      description:
                        'Visualize and advance work through a workflow',
                      icon: FolderOpen,
                    },
                    {
                      id: 'scrum',
                      name: 'Scrum',
                      description: 'Sprint-based development workflow',
                      icon: Calendar,
                    },
                  ].map((template) => (
                    <label
                      key={template.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        watch('template') === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={template.id}
                        {...register('template')}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <template.icon className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Project details
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tell us about your project so we can set it up properly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      onChange={handleNameChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter project name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Project Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project key *
                    </label>
                    <input
                      type="text"
                      {...register('key')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.key ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="PROJECT"
                    />
                    {errors.key && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.key.message}
                      </p>
                    )}
                  </div>

                  {/* Project Lead */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project lead *
                    </label>
                    <select
                      {...register('lead')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lead ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="current-user">You (Current User)</option>
                      <option value="john-doe">John Doe</option>
                      <option value="jane-smith">Jane Smith</option>
                    </select>
                    {errors.lead && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lead.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="software">Software Development</option>
                      <option value="marketing">Marketing</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your project..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Review and create
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Review your project details before creating.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Project name:
                      </span>
                      <p className="text-gray-900">{watch('name') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Project key:
                      </span>
                      <p className="text-gray-900">{watch('key') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Template:
                      </span>
                      <p className="text-gray-900 capitalize">
                        {watch('template')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Category:
                      </span>
                      <p className="text-gray-900 capitalize">
                        {watch('category')}
                      </p>
                    </div>
                  </div>
                  {watch('description') && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Description:
                      </span>
                      <p className="text-gray-900 mt-1">
                        {watch('description')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create project'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProjectPopup
