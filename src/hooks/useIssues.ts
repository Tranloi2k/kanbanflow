import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  skipToken,
} from '@tanstack/react-query'
import { issueApi } from '../services/issueApi'
import type { CreateIssueRequest, IssueQueryParams } from '../types/api'

// Query Keys
export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (filters: IssueQueryParams) =>
    [...issueKeys.lists(), { filters }] as const,
  details: () => [...issueKeys.all, 'detail'] as const,
  detail: (id: string) => [...issueKeys.details(), id] as const,
  statuses: (projectId: string) =>
    [...issueKeys.all, 'statuses', projectId] as const,
}

// Issue Hooks
export const useIssues = (projectId?: string) => {
  return useQuery({
    queryKey: issueKeys.list({ projectId }),
    queryFn: projectId
      ? () => issueApi.getIssuesByProject(projectId)
      : skipToken, // Skip query khi projectId undefined
    staleTime: 0 * 60 * 1000, // 1 minute
    initialData: [],
    enabled: !!projectId,
  })
}

export const useInfiniteIssues = (params?: IssueQueryParams) => {
  return useInfiniteQuery({
    queryKey: issueKeys.list(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      issueApi.getIssues({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Since API returns array directly, implement pagination logic
      const hasMore = lastPage.length === (params?.limit || 10)
      return hasMore ? allPages.length + 1 : undefined
    },
    staleTime: 1 * 60 * 1000,
  })
}

export const useIssue = (id: string) => {
  return useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => issueApi.getIssue(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateIssueRequest) => issueApi.createIssue(data),
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() })
      // Also invalidate project-specific issue lists
      if (newIssue.projectId) {
        queryClient.invalidateQueries({
          queryKey: issueKeys.list({ projectId: newIssue.projectId }),
        })
      }
    },
  })
}

export const useUpdateIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateIssueRequest>
    }) => issueApi.updateIssue(id, data),
    onSuccess: (updatedIssue, { id }) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() })
      if (updatedIssue.projectId) {
        queryClient.invalidateQueries({
          queryKey: issueKeys.list({ projectId: updatedIssue.projectId }),
        })
      }
    },
  })
}

export const useDeleteIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => issueApi.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() })
    },
  })
}

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, statusId }: { id: string; statusId: string }) =>
      issueApi.updateIssueStatus(id, statusId),
    onSuccess: (updatedIssue, { id }) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() })
      if (updatedIssue.projectId) {
        queryClient.invalidateQueries({
          queryKey: issueKeys.list({ projectId: updatedIssue.projectId }),
        })
      }
    },
  })
}

export const useAssignIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
      issueApi.assignIssue(id, assigneeId),
    onSuccess: (updatedIssue, { id }) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() })
      if (updatedIssue.projectId) {
        queryClient.invalidateQueries({
          queryKey: issueKeys.list({ projectId: updatedIssue.projectId }),
        })
      }
    },
  })
}
