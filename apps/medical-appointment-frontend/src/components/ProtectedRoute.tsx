import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from "../content/AuthContext.tsx";
import { MedLogo } from './MedLogo.tsx';

export function ProtectedRoute(){
    const { loading, token } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
                <div className="flex flex-col items-center gap-6">
                        <div className="relative flex items-center justify-center h-24 w-24">
                            <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-40 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-2 border-blue-400 opacity-50 animate-ping [animation-delay:0.2s]" />
                            <div className="absolute inset-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                            <div className="relative z-100 flex h-22 w-22 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30">
                                <MedLogo className="h-18 w-18" />
                            </div>
                        </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-base font-semibold text-slate-700 tracking-tight">МедКабинет</p>
                        <p className="text-xs text-slate-400">Проверка авторизации...</p>
                    </div>

                </div>
            </div>
        )
    }

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}