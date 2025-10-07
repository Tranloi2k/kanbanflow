import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Task } from '../types'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

const TaskCard = ({ task, isDragging = false }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const cardClasses = `
    bg-white p-4 rounded-lg shadow-sm border border-gray-200 
    hover:shadow-md transition-shadow cursor-pointer
    ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}
    ${isSortableDragging ? 'opacity-50' : ''}
  `

  return (
    <div ref={setNodeRef} style={style} className={cardClasses} {...attributes}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {task.title}
        </h3>
        <div
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">#{task.id}</span>
      </div>
    </div>
  )
}

export default TaskCard
