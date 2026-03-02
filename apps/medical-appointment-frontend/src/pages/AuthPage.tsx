import { type FormEvent, type ChangeEvent, useState } from 'react'
import type { LoginFormValues } from '../types/auth.types.ts';
import { useAuth } from '../hooks/useAuth.ts';

function AuthPage() {
    const [type, setType] = useState<'login' | 'register'>('login');
    const [values, setValues] = useState<LoginFormValues>({
        email: '',
        password: '',
    })
    const { login, register, loading: isLoading, error, clearError } = useAuth();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (type === 'login') {
            await login(values);
        } else {
            await register(values);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm">

                <div className="flex flex-col items-center mb-8">
                    <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
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
                    <span className="text-sm font-semibold text-slate-800 tracking-tight">МедКабинет</span>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 px-7 py-8">

                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {type === 'login' ? 'Войти' : 'Регистрация'}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        {type === 'login'
                            ? 'Введите email и пароль для входа в личный кабинет.'
                            : 'Создайте аккаунт для записи к врачу.'}
                    </p>

                    <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>

                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                placeholder=" "
                                autoComplete="email"
                                required
                                className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pt-5 pb-2 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute left-4 top-3.5 text-xs font-medium text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
                            >
                                Email
                            </label>
                        </div>

                        {type === 'register' && (
                            <div className="relative">
                                <input
                                    id="fio"
                                    name="fio"
                                    type="text"
                                    value={values.fio || ''}
                                    onChange={handleChange}
                                    placeholder=" "
                                    autoComplete="name"
                                    required
                                    className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pt-5 pb-2 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <label
                                    htmlFor="fio"
                                    className="pointer-events-none absolute left-4 top-3.5 text-xs font-medium text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
                                >
                                    ФИО
                                </label>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                placeholder=" "
                                autoComplete={type === 'login' ? 'current-password' : 'new-password'}
                                required
                                className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pt-5 pb-2 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <label
                                htmlFor="password"
                                className="pointer-events-none absolute left-4 top-3.5 text-xs font-medium text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
                            >
                                Пароль
                            </label>
                        </div>

                        {type === 'register' && (
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={values.confirmPassword || ''}
                                    onChange={handleChange}
                                    placeholder=" "
                                    autoComplete="new-password"
                                    required
                                    className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pt-5 pb-2 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="pointer-events-none absolute left-4 top-3.5 text-xs font-medium text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs"
                                >
                                    Подтверждение пароля
                                </label>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 rounded-xl bg-red-100 border border-red-400 px-3.5 py-2.5 text-sm font-medium text-red-700">
                                <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                                {error}
                            </div>
                        )}


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 cursor-pointer transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            )}
                            {type === 'login' ? 'Войти в кабинет' : 'Зарегистрироваться'}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-slate-500">
                    {type === 'login' ? 'Нет аккаунта?' : 'Уже есть кабинет?'}{' '}
                    <button
                        type="button"
                        className="font-semibold text-blue-600 hover:underline cursor-pointer"
                        onClick={() => { setType(type === 'login' ? 'register' : 'login'); clearError?.(); }}>
                        {type === 'login' ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </p>

                <p className="mt-4 text-center text-xs text-blue-900/30">
                    © 2026 МедКабинет
                </p>
            </div>
        </div>
    )

}

export default AuthPage
