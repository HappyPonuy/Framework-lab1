import './App.css'
import AuthPage from './pages/AuthPage.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import AdminPage from './pages/AdminPage.tsx';
import DoctorPage from './pages/DoctorPage.tsx';
import HomePage from './pages/HomePage.tsx';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from './stores/StoreContext.tsx';

const RoleRouter = observer(function RoleRouter() {
    const authStore = useAuthStore();
    if (authStore.user?.role === 'A') return <AdminPage />;
    if (authStore.user?.role === 'D') return <DoctorPage />;
    if (authStore.user?.role === 'P') return <HomePage />;
    return <Navigate to="/auth" replace />;
});

const AuthRoute = observer(function AuthRoute() {
    const authStore = useAuthStore();
    if (authStore.token) return <Navigate to="/" replace />;
    return <AuthPage />;
});

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthRoute />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<RoleRouter />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
