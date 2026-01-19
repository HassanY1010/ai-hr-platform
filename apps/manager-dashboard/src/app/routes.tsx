import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import RecruitmentPage from '@/modules/recruitment/pages/RecruitmentPage';
import JobsPage from '@/modules/recruitment/jobs/pages/JobsPage';
import CandidatesPage from '@/modules/recruitment/candidates/pages/CandidatesPage';
import InterviewsPage from '@/modules/recruitment/interviews/pages/InterviewsPage';
import EmployeesPage from '@/modules/employees/pages/EmployeesPage';
import TasksProjectsPage from '@/modules/tasks-projects/pages/TasksProjectsPage';
import TrainingPage from '@/modules/training/pages/TrainingPage';
import AlertsPage from '@/modules/alerts/pages/AlertsPage';
import LoginPage from '@/pages/LoginPage';
import { SettingsPage } from '@/pages/SettingsPage';
import MainLayout from '@/layouts/MainLayout';
import { useManagerStore } from '@/store/manager.store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useManagerStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="recruitment">
                        <Route index element={<RecruitmentPage />} />
                        <Route path="jobs" element={<JobsPage />} />
                        <Route path="candidates" element={<CandidatesPage />} />
                        <Route path="interviews" element={<InterviewsPage />} />
                    </Route>
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="tasks-projects" element={<TasksProjectsPage />} />
                    <Route path="training" element={<TrainingPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
