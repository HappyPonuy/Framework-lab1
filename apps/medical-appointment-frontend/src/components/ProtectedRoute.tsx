import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../stores/StoreContext.tsx';

export const ProtectedRoute = observer(function ProtectedRoute() {
    const authStore = useAuthStore();

    if (authStore.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
                <p className="text-slate-500 text-sm">Загрузка...</p>
            </div>
        );
    }

    if (!authStore.token) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
});
