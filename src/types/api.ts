// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// Project Types
export interface Project {
  id: string
  name: string
  description?: string
  key: string
  category: string
  template: string
  leadId?: string
  avatarColor?: string
  isStarred?: boolean
  isArchived?: boolean
  createdAt?: string
  updatedAt?: string
  members?: ProjectMember[]
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role?: string
  joinedAt?: string
  user?: User
}

export interface CreateProjectRequest {
  name: string
  key: string
  description?: string
  category: string
  template: string
  leadId?: string
}

// Issue Types
export interface Issue {
  id: string
  projectId?: string
  title: string
  description?: string
  issueType?: string
  priority?: string
  statusId?: string
  assigneeId?: string
  reporterId: string
  storyPoints?: number
  position?: number
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  // Relations (populated by backend)
  project?: Project
  status?: IssueStatus
  assignee?: User
  reporter?: User
  comments?: IssueComment[]
  labels?: Label[]
}

// Label Types
export interface Label {
  id: string
  name: string
  color?: string
  createdAt?: string
  updatedAt?: string
}

export interface IssueStatus {
  id: string
  projectId?: string
  name: string
  position: number
  color?: string
  createdAt?: string
}

export interface IssueComment {
  id: string
  issueId?: string
  authorId: string
  content: string
  createdAt?: string
  updatedAt?: string
  author?: User
}

export interface CreateIssueRequest {
  title: string
  description?: string
  issueType?: string
  priority?: string
  projectId?: string
  assigneeId?: string
  reporterId: string
  statusId?: string
  storyPoints?: number
  dueDate?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    message: string
    code?: string
    statusCode: number
  }
}

// Query Parameters
export interface IssueQueryParams {
  projectId?: string
  statusId?: string
  assigneeId?: string
  priority?: string
  issueType?: string
  page?: number
  limit?: number
}

export interface ProjectQueryParams {
  userId?: string
  category?: string
  template?: string
  search?: string
  page?: number
  limit?: number
}
