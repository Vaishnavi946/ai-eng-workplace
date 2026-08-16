import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SprintsPage from './pages/SprintsPage';
import SprintDetailPage from './pages/SprintDetailPage';
import TasksPage from './pages/TasksPage';
import ReviewQueuePage from './pages/ReviewQueuePage';
import PRDetailPage from './pages/PRDetailPage';
import DocsSearchPage from './pages/DocsSearchPage';
import ActivityPage from './pages/ActivityPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sprints" element={<SprintsPage />} />
        <Route path="/sprints/:id" element={<SprintDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/review-queue" element={<ReviewQueuePage />} />
        <Route path="/review-queue/:id" element={<PRDetailPage />} />
        <Route path="/docs-search" element={<DocsSearchPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}