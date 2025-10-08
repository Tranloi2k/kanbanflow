import { apiClient } from '../lib/api'
import type {
  Issue,
  CreateIssueRequest,
  IssueQueryParams,
  IssueComment,
  ApiResponse,
} from '../types/api'

export const issueApi = {
  // Get all issues with filters
  getIssues: async (params?: IssueQueryParams): Promise<Issue[]> => {
    const response = await apiClient.get<ApiResponse<Issue[]>>('/issues', {
      params,
    })
    return response.data.data
  },

  // Get issues by project
  getIssuesByProject: async (projectId: string): Promise<Issue[]> => {
    const response = await apiClient.get<ApiResponse<Issue[]>>(
      `/issues/project/${projectId}`
    )
    console.log(response.data)
    return response.data.data
  },

  // Get issue by ID
  getIssue: async (id: string): Promise<Issue> => {
    const response = await apiClient.get<ApiResponse<Issue>>(`/issues/${id}`)
    return response.data.data
  },

  // Create issue
  createIssue: async (data: CreateIssueRequest): Promise<Issue> => {
    const response = await apiClient.post<ApiResponse<Issue>>('/issues', data)
    return response.data.data
  },

  // Update issue
  updateIssue: async (
    id: string,
    data: Partial<CreateIssueRequest>
  ): Promise<Issue> => {
    const response = await apiClient.put<ApiResponse<Issue>>(
      `/issues/${id}`,
      data
    )
    return response.data.data
  },

  // Delete issue
  deleteIssue: async (id: string): Promise<void> => {
    await apiClient.delete(`/issues/${id}`)
  },

  // Update issue status
  updateIssueStatus: async (id: string, statusId: string): Promise<Issue> => {
    const response = await apiClient.patch<ApiResponse<Issue>>(
      `/issues/${id}/status`,
      { statusId }
    )
    return response.data.data
  },

  // Assign issue to user
  assignIssue: async (id: string, assigneeId?: string): Promise<Issue> => {
    const response = await apiClient.patch<ApiResponse<Issue>>(
      `/issues/${id}/assign`,
      { assigneeId }
    )
    return response.data.data
  },

  // Get issue comments
  getIssueComments: async (issueId: string): Promise<IssueComment[]> => {
    const response = await apiClient.get<ApiResponse<IssueComment[]>>(
      `/issues/${issueId}/comments`
    )
    return response.data.data
  },

  // Add comment to issue
  addComment: async (
    issueId: string,
    content: string
  ): Promise<IssueComment> => {
    const response = await apiClient.post<ApiResponse<IssueComment>>(
      `/issues/${issueId}/comments`,
      { content }
    )
    return response.data.data
  },
}
