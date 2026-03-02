import './App.css'
import AuthPage from "./pages/AuthPage.tsx";
import {AuthProvider} from "./content/AuthContext.tsx";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import AdminPage from "./pages/AdminPage.tsx";


function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<AdminPage />} />
                    </Route>
                    <Route path="/*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
  )
}

export default App
