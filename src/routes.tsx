import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router'

const Home = lazy(() => import('./pages/Home'))
const ProjectPage = lazy(() => import('./pages/project'))
const ProjectBoardPage = lazy(() => import('./pages/project/board'))
const ProjectReportPage = lazy(() => import('./pages/project/report'))
const ProjectBacklog = lazy(() => import('./pages/project/backlog'))
const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang Tải...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/*" element={<ProjectPage />}>
          <Route index element={<ProjectBacklog />} />
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
