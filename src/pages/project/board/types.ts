export interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  order?: number
}

export interface Column {
  id: string
  title: string
  color: string
}
