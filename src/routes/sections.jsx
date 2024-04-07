import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';

const IndexPage = lazy(() => import('src/pages/app'));
const ActionsPage = lazy(() => import('src/pages/actions'));
const UserPage = lazy(() => import('src/pages/user'));
const EventPage = lazy(() => import('src/pages/event'));
const CameraPage = lazy(() => import('src/pages/camera'));
const LoginPage = lazy(() => import('src/pages/login'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = ['id', 'name', 'email', 'role'].every(item => localStorage.getItem(item));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function Router() {
const isAdmin = localStorage.getItem('role') == 'admin';


  return useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <IndexPage />, index: true },

        { path: 'event', element: <EventPage /> },
        { path: 'camera', element: <CameraPage /> },
        { path: 'actions', element: <ActionsPage /> },
        isAdmin && { path: 'user', element: <UserPage /> },
        // Define other protected routes here
      ],
    },
    { path: 'login', element: <LoginPage /> },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
