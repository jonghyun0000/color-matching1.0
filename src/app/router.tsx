import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { HomePage } from '../features/home/HomePage';
import { TeamRegisterPage } from '../features/teams/TeamRegisterPage';
import { RequestsPage } from '../features/matches/RequestsPage';
import { ReviewsPage } from '../features/reviews/ReviewsPage';
import { MyPage } from '../features/mypage/MyPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AdminRoute } from '../routes/AdminRoute';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'teams', element: <TeamRegisterPage /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'admin', element: <AdminRoute><AdminDashboardPage /></AdminRoute> }
    ]
  }
]);
