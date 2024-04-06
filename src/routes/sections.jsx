import { lazy, Suspense, useMemo } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const EventPage = lazy(() => import('src/pages/event'));
export const CameraPage = lazy(() => import('src/pages/camera'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const isAuthenticated = useMemo(() => {
    return ['id', 'name', 'email', 'role'].every((item) => localStorage.getItem(item));
  }, []);

  const routes = useRoutes([
    {
      element: isAuthenticated ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'event', element: <EventPage /> },
        { path: 'camera', element: <CameraPage /> },
        // Add other authenticated routes here
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
