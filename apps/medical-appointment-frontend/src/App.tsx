import './App.css'
import AuthPage from "./pages/AuthPage.tsx";
import { AuthProvider } from "./content/AuthContext.tsx";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import DoctorPage from "./pages/DoctorPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { useAuth } from "./content/AuthContext.tsx";


function RoleRouter() {
    const { user } = useAuth()
    if (user?.role === 'A') return <AdminPage />
    if (user?.role === 'D') return <DoctorPage />
    if (user?.role === 'P') return <HomePage />
    return <Navigate to="/auth" replace />
}

function AuthRoute() {
    const { token, loading } = useAuth();
    if (loading) return null;
    if (token) return <Navigate to="/" replace />;
    return <AuthPage />;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/auth" element={<AuthRoute />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<RoleRouter />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
