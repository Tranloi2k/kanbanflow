import { apiClient } from '../lib/api'
import type {
  Project,
  CreateProjectRequest,
  ProjectQueryParams,
  ProjectMember,
  ApiResponse,
} from '../types/api'

export const projectApi = {
  // Get all projects
  getProjects: async (params?: ProjectQueryParams): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects', {
      params,
    })
    return response.data.data
  },

  // Get projects by user
  getProjectsByUser: async (userId: string): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(
      `/projects/user/${userId}`
    )
    return response.data.data
  },

  // Get project by ID
  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${id}`
    )
    return response.data.data
  },

  // Create project
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      '/projects',
      data
    )
    return response.data.data
  },

  // Update project
  updateProject: async (
    id: string,
    data: Partial<CreateProjectRequest>
  ): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    )
    return response.data.data
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
  },

  // Get project members
  getProjectMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await apiClient.get<ApiResponse<ProjectMember[]>>(
      `/projects/${projectId}/members`
    )
    return response.data.data
  },

  // Add member to project
  addMember: async (
    projectId: string,
    data: { userId: string; role?: string }
  ): Promise<ProjectMember> => {
    const response = await apiClient.post<ApiResponse<ProjectMember>>(
      `/projects/${projectId}/members`,
      data
    )
    return response.data.data
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/members/${userId}`)
  },
}
