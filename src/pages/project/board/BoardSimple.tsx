import { useState, useMemo } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import KanbanColumn from './components/KanbanColumn'
import TaskCard from './components/TaskCard'

// Types
interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  order?: number
}

interface Column {
  id: string
  title: string
  color: string
}

// Sample data
const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-red-100 text-red-600' },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-yellow-100 text-yellow-600',
  },
  { id: 'done', title: 'Done', color: 'bg-green-100 text-green-600' },
]

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Thiết kế UI cho trang chủ',
    description: 'Tạo mockup và wireframe',
    columnId: 'todo',
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Login, register, logout',
    columnId: 'todo',
  },
  {
    id: '3',
    title: 'Setup database',
    description: 'PostgreSQL với Prisma ORM',
    columnId: 'in-progress',
  },
  {
    id: '4',
    title: 'Create API endpoints',
    description: 'REST API cho user management',
    columnId: 'in-progress',
  },
  {
    id: '5',
    title: 'Deploy to production',
    description: 'Setup CI/CD pipeline',
    columnId: 'done',
  },
]

export default function ProjectBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columnTasks = useMemo(() => {
    const result: { [key: string]: Task[] } = {}
    initialColumns.forEach((column) => {
      result[column.id] = tasks.filter((task) => task.columnId === column.id)
    })
    return result
  }, [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveTask(tasks.find((task) => task.id === active.id) || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((task) => task.id === activeId)
    if (!activeTask) return

    // Check if dropping over a column
    const overColumn = initialColumns.find((col) => col.id === overId)
    if (overColumn && activeTask.columnId !== overColumn.id) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overColumn.id } : task
        )
      )
      return
    }

    // Check if dropping over another task
    const overTask = tasks.find((task) => task.id === overId)
    if (overTask && activeTask.columnId !== overTask.columnId) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overTask.columnId } : task
        )
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find((task) => task.id === activeId)
    const overTask = tasks.find((task) => task.id === overId)

    if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
      const columnTasksList = columnTasks[activeTask.columnId]
      const activeIndex = columnTasksList.findIndex(
        (task) => task.id === activeId
      )
      const overIndex = columnTasksList.findIndex((task) => task.id === overId)

      const newTasks = arrayMove(columnTasksList, activeIndex, overIndex)

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks]
        newTasks.forEach((task, index) => {
          const taskIndex = updatedTasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = { ...task, order: index }
          }
        })
        return updatedTasks
      })
    }
  }

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Task description',
      columnId,
    }
    setTasks([...tasks, newTask])
  }

  return (
    <div className="px-6 pt-1 pb-4 h-full w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialColumns.map((column) => (
            <SortableContext
              key={column.id}
              items={columnTasks[column.id]?.map((task) => task.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={columnTasks[column.id] || []}
                onAddTask={() => addTask(column.id)}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
