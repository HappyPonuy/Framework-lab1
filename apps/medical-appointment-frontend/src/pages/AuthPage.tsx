import { type FormEvent, type ChangeEvent, useState } from 'react'
import type { LoginFormValues, RegisterFormValues } from '../types/auth.types.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { MedLogo } from '../components/MedLogo.tsx';

const INITIAL_LOGIN: LoginFormValues = { username: '', password: '' }
const INITIAL_REGISTER: RegisterFormValues = {
    username: '', password: '', confirmPassword: '',
    first_name: '', last_name: '', patronymic: '',
    email: '', phone: '', birth_date: new Date(), gender: 'M',
    role: 'P',
}

function FloatInput({
    id, name, type = 'text', label, value, onChange, required = false, autoComplete,
}: {
    id: string; name: string; type?: string; label: string;
    value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean; autoComplete?: string;
}) {
    return (
        <div className="relative">
            <input
                id={id} name={name} type={type} value={value}
                onChange={onChange} placeholder=" "
                autoComplete={autoComplete} required={required}
                className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pt-5 pb-2 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <label htmlFor={id}
                className="pointer-events-none absolute left-4 top-3.5 text-xs font-medium text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500 peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
            >
                {label}
            </label>
        </div>
    )
}

function AuthPage() {
    const [type, setType] = useState<'login' | 'register'>('login');
    const [loginValues, setLoginValues] = useState<LoginFormValues>(INITIAL_LOGIN)
    const [regValues, setRegValues] = useState<RegisterFormValues>(INITIAL_REGISTER)
    const [birthDateStr, setBirthDateStr] = useState<string>('')
    const { login, register, loading: isLoading, error, successMessage, clearError } = useAuth();

    const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLoginValues(prev => ({ ...prev, [name]: value }))
    }

    const handleRegChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === 'birth_date') {
            setBirthDateStr(value)
            setRegValues(prev => ({ ...prev, birth_date: value ? new Date(value) : new Date() }))
        } else {
            setRegValues(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (type === 'login') {
            await login(loginValues.username, loginValues.password);
        } else {
            await register(regValues);
        }
    }

    const switchType = (next: 'login' | 'register') => {
        setType(next)
        clearError?.()
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm">

                <div className="flex flex-col items-center mb-8">
                    <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
                        <MedLogo className="h-18 w-18" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 tracking-tight">МедКабинет</span>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 px-7 py-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {type === 'login' ? 'Войти' : 'Регистрация'}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        {type === 'login'
                            ? 'Введите логин и пароль для входа в личный кабинет.'
                            : 'Создайте аккаунт для записи к врачу.'}
                    </p>

                    <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>

                        {type === 'login' ? (
                            <>
                                <FloatInput id="username" name="username" label="Логин"
                                    value={loginValues.username} onChange={handleLoginChange}
                                    required autoComplete="username" />
                                <FloatInput id="password" name="password" type="password" label="Пароль"
                                    value={loginValues.password} onChange={handleLoginChange}
                                    required autoComplete="current-password" />
                            </>
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide -mb-1">Учётная запись</p>
                                <FloatInput id="username" name="username" label="Логин *"
                                    value={regValues.username} onChange={handleRegChange}
                                    required autoComplete="username" />
                                <FloatInput id="password" name="password" type="password" label="Пароль *"
                                    value={regValues.password} onChange={handleRegChange}
                                    required autoComplete="new-password" />
                                <FloatInput id="confirmPassword" name="confirmPassword" type="password" label="Подтверждение пароля *"
                                    value={regValues.confirmPassword} onChange={handleRegChange}
                                    required autoComplete="new-password" />

                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1 -mb-1">Личные данные</p>
                                <FloatInput id="last_name" name="last_name" label="Фамилия *"
                                    value={regValues.last_name} onChange={handleRegChange} required />
                                <FloatInput id="first_name" name="first_name" label="Имя *"
                                    value={regValues.first_name} onChange={handleRegChange} required />
                                <FloatInput id="patronymic" name="patronymic" label="Отчество"
                                    value={regValues.patronymic ?? ''} onChange={handleRegChange} />
                                <FloatInput id="email" name="email" type="email" label="Email *"
                                    value={regValues.email} onChange={handleRegChange}
                                    required autoComplete="email" />
                                <FloatInput id="phone" name="phone" type="tel" label="Телефон"
                                    value={regValues.phone ?? ''} onChange={handleRegChange} />

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="relative">
                                        <input
                                            id="birth_date" name="birth_date" type="date"
                                            value={birthDateStr} onChange={handleRegChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                        />
                                        <label htmlFor="birth_date" className="block text-xs text-slate-400 mb-0.5 absolute -top-5 left-2">Дата рождения *</label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            id="gender" name="gender"
                                            value={regValues.gender} onChange={handleRegChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                        >
                                            <option value="M">Мужской</option>
                                            <option value="F">Женский</option>
                                        </select>
                                        <label htmlFor="gender" className="block text-xs text-slate-400 mb-0.5 absolute -top-5 left-2">Пол *</label>
                                    </div>
                                </div>
                            </>
                        )}

                        {successMessage && (
                            <div className="flex items-center gap-2 rounded-xl bg-green-100 border border-green-400 px-3.5 py-2.5 text-sm font-medium text-green-700">
                                <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                {successMessage}
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
                        onClick={() => switchType(type === 'login' ? 'register' : 'login')}
                    >
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
