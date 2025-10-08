import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { projectApi } from '../services/projectApi'
import type { CreateProjectRequest, ProjectQueryParams } from '../types/api'

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectQueryParams) =>
    [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  members: (id: string) => [...projectKeys.detail(id), 'members'] as const,
}

// Project Hooks
export const useProjects = (params?: ProjectQueryParams) => {
  return useQuery({
    queryKey: projectKeys.list(params || {}),
    queryFn: () => projectApi.getProjects(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => ({ data }), // Wrap in data object for compatibility
  })
}

export const useProjectsByUser = (userId: string) => {
  return useQuery({
    queryKey: [...projectKeys.lists(), 'user', userId],
    queryFn: () => projectApi.getProjectsByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  })
}

export const useInfiniteProjects = (params?: ProjectQueryParams) => {
  return useInfiniteQuery({
    queryKey: projectKeys.list(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      projectApi.getProjects({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Since API returns array directly, implement pagination logic
      const hasMore = lastPage.length === (params?.limit || 10)
      return hasMore ? allPages.length + 1 : undefined
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateProjectRequest>
    }) => projectApi.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => projectApi.getProjectMembers(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddProjectMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string
      data: { userId: string; role: 'ADMIN' | 'MEMBER' | 'VIEWER' }
    }) => projectApi.addMember(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.members(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId),
      })
    },
  })
}

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string
      userId: string
    }) => projectApi.removeMember(projectId, userId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.members(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId),
      })
    },
  })
}
