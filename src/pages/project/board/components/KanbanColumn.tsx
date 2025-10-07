import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { Column, Task } from '../types'
import TaskCard from './TaskCard'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onAddTask: () => void
}

const KanbanColumn = ({ column, tasks, onAddTask }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg p-4 min-h-[600px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${column.color}`}
          >
            {column.title}
          </div>
          <span className="text-gray-500 text-sm">({tasks.length})</span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Add task"
        >
          <Plus className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Drop Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 transition-colors ${
          isOver
            ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-2'
            : ''
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Drop tasks here or click + to add
          </div>
        )}
      </div>
    </div>
  )
}

export default KanbanColumn
