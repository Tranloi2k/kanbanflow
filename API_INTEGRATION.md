# KanbanFlow - API Integration Guide

## Tổng quan

KanbanFlow đã được tích hợp hoàn toàn với React Query và Axios để quản lý API calls một cách hiệu quả.

## 🚀 Cài đặt

### Dependencies đã cài đặt:

- `@tanstack/react-query` - Data fetching và caching
- `@tanstack/react-query-devtools` - DevTools cho development
- `axios` - HTTP client

### Environment Variables:

Tạo file `.env` với nội dung:

```env
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

## 📁 Cấu trúc API

```
src/
├── lib/
│   └── api.ts              # Axios configuration
├── services/
│   ├── authApi.ts          # Authentication API calls
│   ├── projectApi.ts       # Project API calls
│   └── issueApi.ts         # Issue API calls
├── hooks/
│   ├── useAuth.ts          # Auth React Query hooks
│   ├── useProjects.ts      # Project React Query hooks
│   └── useIssues.ts        # Issue React Query hooks
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── types/
│   └── api.ts              # TypeScript types
└── components/
    └── common/
        └── ProtectedRoute.tsx # Route protection
```

## 🔐 Authentication Flow

### Login:

```typescript
import { useLogin } from '../hooks/useAuth'

const LoginComponent = () => {
  const loginMutation = useLogin()

  const handleLogin = async (data) => {
    try {
      const response = await loginMutation.mutateAsync(data)
      // Token và user data được tự động lưu vào localStorage
      // và redirect đến /projects
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
```

### Register:

```typescript
import { useRegister } from '../hooks/useAuth'

const RegisterComponent = () => {
  const registerMutation = useRegister()

  const handleRegister = async (data) => {
    try {
      const response = await registerMutation.mutateAsync(data)
      // Tự động login sau khi register thành công
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }
}
```

### Protected Routes:

```typescript
import { ProtectedRoute } from '../components/common/ProtectedRoute'

// Route yêu cầu authentication
<Route path="/projects" element={
  <ProtectedRoute>
    <ProjectList />
  </ProtectedRoute>
} />

// Route cho guest users (redirect nếu đã login)
<Route path="/login" element={
  <PublicRoute>
    <LoginPage />
  </PublicRoute>
} />
```

## 📊 Data Fetching với React Query

### Projects:

```typescript
import { useProjects, useCreateProject } from '../hooks/useProjects'

const ProjectList = () => {
  // Fetch projects với filtering
  const { data, isLoading, error } = useProjects({
    search: 'web',
    type: 'SOFTWARE',
    page: 1,
    limit: 10,
  })

  // Create project
  const createMutation = useCreateProject()

  const handleCreate = async (projectData) => {
    await createMutation.mutateAsync(projectData)
    // Cache sẽ tự động update
  }
}
```

### Issues:

```typescript
import { useIssues, useCreateIssue } from '../hooks/useIssues'

const IssueBoard = () => {
  const { data: issues } = useIssues({
    projectId: 'project-123',
    status: 'TODO',
  })

  const createIssueMutation = useCreateIssue()
}
```

## 🔄 Cache Management

React Query tự động quản lý cache với các tính năng:

- **Automatic Background Refetching**: Dữ liệu được tự động cập nhật
- **Optimistic Updates**: UI update ngay lập tức
- **Cache Invalidation**: Tự động invalidate cache khi có mutations
- **Offline Support**: Hoạt động cả khi offline

### Query Keys Structure:

```typescript
// Projects
;['projects'][('projects', 'list', { filters })][ // All projects lists // Specific filtered list
  ('projects', 'detail', projectId)
][ // Individual project
  // Issues
  'issues'
][('issues', 'list', { filters })][('issues', 'detail', issueId)] // All issues lists // Specific filtered list // Individual issue
```

## 🛡️ Error Handling

### API Interceptors:

- **Request**: Tự động thêm Authorization header
- **Response**: Handle 401 errors và redirect về login

### Component Level:

```typescript
const { data, isLoading, error } = useProjects()

if (isLoading) return <Loading />
if (error) return <ErrorMessage error={error} />
```

## 📝 API Endpoints Expected

Backend cần implement các endpoints sau:

### Authentication:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Projects:

- `GET /api/projects` - List projects với pagination/filtering
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project detail
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Issues:

- `GET /api/issues` - List issues với filtering
- `POST /api/issues` - Create issue
- `GET /api/issues/:id` - Get issue detail
- `PUT /api/issues/:id` - Update issue
- `PATCH /api/issues/bulk-update` - Bulk update cho drag & drop

## 🔧 Development Tools

### React Query DevTools:

DevTools được tự động load ở development mode để inspect:

- Query states
- Cache contents
- Network requests
- Mutations

### Testing API:

Truy cập `/api-test` để kiểm tra API integration status.

## 🚀 Production Ready Features

- **Token Refresh**: Tự động refresh token khi expired
- **Request Retry**: Retry failed requests
- **Loading States**: Comprehensive loading states
- **Error Boundaries**: Proper error handling
- **Type Safety**: Full TypeScript support
- **Performance**: Optimized với caching và lazy loading

## Next Steps

1. **Backend Implementation**: Tạo Express.js server với PostgreSQL
2. **Real-time Updates**: WebSocket integration cho collaborative features
3. **Offline Support**: Enhanced offline capabilities
4. **File Upload**: Image và attachment handling
5. **Search**: Advanced search với full-text search
