import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'
import MainLayout from './components/layout/appLayout/MainLayout'

const Home = lazy(() => import('./pages/Home'))
const ProjectDashboard = lazy(() => import('./pages/project/ProjectDashboard'))
const ProjectBoardPage = lazy(() => import('./pages/project/board'))
const ProjectReportPage = lazy(() => import('./pages/project/report'))
const ProjectBacklog = lazy(() => import('./pages/project/backlog'))
const ListProject = lazy(() => import('./pages/project/ListProject'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang Tải...</div>}>
      <Routes>
        {/* Public Routes - redirect to projects if authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes - require authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ListProject />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ListProject />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route path="backlog" element={<ProjectBacklog />} />
          <Route path="board" element={<ProjectBoardPage />} />
          <Route path="report" element={<ProjectReportPage />} />
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
