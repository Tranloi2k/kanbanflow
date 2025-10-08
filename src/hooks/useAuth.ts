import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../services/authApi'
import type { LoginRequest, RegisterRequest } from '../types/api'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
}

// Auth Hooks
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      // Store token (no refresh token in API)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      // Update query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user)
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      // Store token (no refresh token in API)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      // Update query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user)
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Just clear local storage since API doesn't have logout endpoint
      return Promise.resolve()
    },
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')

      // Clear query cache
      queryClient.clear()

      // Redirect to login
      window.location.href = '/login'
    },
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
