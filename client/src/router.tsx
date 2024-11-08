import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components';

const HomePage = lazy(() => import('./pages/HomePage'));
const UrlPage = lazy(() => import('./pages/UrlPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ':shortenUrlKey', element: <UrlPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

export default router;
