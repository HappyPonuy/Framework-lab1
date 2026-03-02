import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from "../content/AuthContext.tsx";

export function ProtectedRoute(){
    const { user, loading } = useAuth();
    const isAuthenticated = user !== null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
                <div className="flex flex-col items-center gap-6">

                    <div className="relative flex items-center justify-center h-24 w-24">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-40 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-2 border-blue-400 opacity-50 animate-ping [animation-delay:0.2s]" />
                        <div className="absolute inset-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                        <div className="relative z-10 flex h-22 w-22 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30">
                            <svg
                                className="h-18 w-18"
                                viewBox="0 0 473.931 473.931"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle fill="#49A0AE" cx="236.966" cy="236.966" r="236.966" />
                                <path fill="#996B33" d="M239.132,427.882c0,4.954-0.819,8.973-1.833,8.973l0,0c-1.022,0-1.841-4.019-1.841-8.973l-11.861-383.04c0-4.95,6.133-8.973,13.702-8.973l0,0c7.562,0,13.695,4.022,13.695,8.973L239.132,427.882z" />
                                <path fill="#A77640" d="M237.299,436.858L237.299,436.858c-1.022,0-1.841-4.019-1.841-8.973l-11.861-383.04c0-4.95,6.133-8.973,13.702-8.973l0,0L237.299,436.858L237.299,436.858z" />
                                <path fill="#74BB4D" d="M264.617,267.064c-42.824-18.829-41.159-32.273-39.756-45.369c1.489-13.927,17.122-20.815,23.693-23.693c9.983-4.363,28.737-10.784,35.24-13.096c33.275-11.854,44.587-54.244,1.792-76.493c-6.204-3.225-15.873-7.263-27.442-11.839c-5.56-2.196-16.976,9.762-9.399,12.595c0.745,0.273,2.866,4.251,3.551,4.658c44.594,26.484,20.587,56.111,1.456,60.373c-0.116-0.052-66.921,12.576-67.557,44.392c-0.621,30.858,8.924,42.753,52.078,60.789c6.701,2.799,12.767,12.535,11.379,27.902c-1.527,16.89-5.16,25.212-12.352,28.583c-19.959,9.354-38.009,22.211-38.009,49.84c0,38.267,74.446,40.145,74.446,40.145s7.177,1.602,7.951-3.042c0.468-2.806-1.949-3.427-1.949-3.427s-49.893,3.349-49.893-34.918c0-27.633,12.834-31.88,37.418-47.401C292.213,321.316,288.19,277.429,264.617,267.064z" />
                                <path fill="#996B33" d="M245.774,214.515c-2.339,0-5.276,0-8.479,0l0,0v-52.957l0,0c3.895,0,7.416,0,9.908,0L245.774,214.515z" />
                                <path fill="#A77640" d="M237.299,214.515L237.299,214.515c-3.244,0-6.219,0-8.565,0l-1.616-52.957h10.181l0,0V214.515z" />
                                <path fill="#996B33" d="M241.018,363.763c-1.182,0-2.432,0-3.719,0l0,0V330.45v0.153c1.579,0,3.106-0.153,4.524-0.153L241.018,363.763z" />
                                <g>
                                    <path fill="#A77640" d="M237.299,363.763L237.299,363.763c-1.358,0-2.462,2.78-3.697,2.78l-1.014-30.675h4.715l0,0v27.895H237.299z" />
                                    <circle fill="#A77640" cx="237.34" cy="53.937" r="19.955" />
                                </g>
                                <path fill="#996B33" d="M257.287,53.937c0,11.019-8.939,19.959-19.959,19.959v-39.91C248.348,33.986,257.287,42.918,257.287,53.937z" />
                                <path fill="#CC4028" d="M229.684,115.852c-7.843,2.17-15.596,3.689-21.945,3.689c-7.446,0-12.554-8.408-20.527-19.034c0,0,4.288,0.202,9.538,3.742l2.859-7.764c0,0,2.324,6.065,1.227,10.627c0,0,2.069,7.109,9.601,7.368c2.814,0.09,7.124-0.737,12.913-2.223C233.441,109.671,249.239,110.434,229.684,115.852z" />
                                <path fill="#74BB4D" d="M249.804,94.962c-13.916-0.37-31.958,7.914-32.187,15.442c-0.206,7.517,17.987,14.125,31.891,14.458c13.908,0.37,18.308-5.624,18.525-13.149c0.03-1.272-0.543-4.793-0.73-5.336C265.601,101.432,260.232,95.228,249.804,94.962z" />
                                <circle fill="#555C49" cx="244" cy="104.807" r="4.209" />
                            </svg>
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



    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}