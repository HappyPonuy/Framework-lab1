import { useState } from 'react'
import { useAuth } from '../content/AuthContext.tsx'
import { useAdmin, AdminProvider } from '../content/AdminContext.tsx'
import { progressClass } from '../utils/appointmentStatus.ts'
import { Toast } from '../components/Toast.tsx'
import { useToast } from '../hooks/useToast.ts'
import { MedLogo } from '../components/MedLogo.tsx'
import { UserAvatar } from '../components/UserAvatar.tsx'

const activeMap = {
    active:   { label: 'Активен',   className: 'bg-green-50 text-green-700 border border-green-200' },
    inactive: { label: 'Неактивен', className: 'bg-slate-100 text-slate-400 border border-slate-200' },
}



function AdminPageContent() {
    const { user, logout } = useAuth()
    const { doctors, appointments, patients, loading, error, deleteAppointment } = useAdmin()
    const { toast, hideToast, withErrorToast } = useToast()

    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'appointments'>('overview')

    const tabs = [
        { key: 'overview',     label: 'Обзор' },
        { key: 'doctors',      label: 'Врачи' },
        { key: 'appointments', label: 'Записи' },
    ] as const


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
                <p className="text-slate-500 text-sm">Загрузка...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        )
    }

    return (
        <>
        <div className="min-h-screen bg-[#dbeafe]">

            <header className="bg-white border-b border-blue-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-600/30">
                            <MedLogo />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">МедКабинет</span>
                        <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Администратор</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-xs font-medium text-slate-700">{user?.username}</span>
                        <button onClick={() => logout()} className="text-xs text-slate-400 hover:text-red-500 transition">Выйти</button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">Панель администратора</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Управление системой записи к врачу</p>
                </div>

                <div className="flex gap-1 bg-white/70 rounded-xl p-1 border border-blue-100 mb-5 w-fit flex-wrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={
                                'px-4 py-1.5 rounded-lg text-sm font-medium transition ' +
                                (activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Всего врачей',    value: doctors.length, color: 'text-blue-600' },
                                { label: 'Записей всего',   value: appointments.length, color: 'text-slate-700' },
                                { label: 'Активных врачей', value: doctors.filter(d => d.is_active).length, color: 'text-green-600' },
                            ].map(s => (
                                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50">
                                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Последние записи</h3>
                            {appointments.length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-4">Записей пока нет</p>
                            ) : (
                            <div className="space-y-2">
                                {appointments.slice(0, 3).map(a => {
                                    const doc = doctors.find(d => d.id === a.doctor_id)
                                    const docName = doc ? `${doc.last_name} ${(doc.first_name ?? '')[0] ?? ''}.`.trim() : 'Врач не найден'
                                    const timeStr = a.start_time ? new Date(a.start_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
                                    const patient = patients.find(p => p.id === a.patient_id)
                                    const patientName = patient
                                        ? `${patient.last_name} ${patient.first_name} ${patient.patronymic ?? ''}`.trim()
                                        : 'Пациент не найден'

                                    return (
                                        <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {patientName} → {docName}
                                                </p>
                                                <p className="text-xs text-slate-400">{doc?.specialty ?? ''} · {timeStr}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${progressClass(a.progress)}`}>
                                                {a.progress}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-700">Все врачи</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {doctors.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-slate-400 text-sm">Врачи не найдены</p>
                                </div>
                            ) : doctors.map(d => {
                                const fullName = `${d.last_name ?? ''} ${d.first_name ?? ''} ${d.patronymic ?? ''}`.trim() || '—'
                                return (
                                    <div key={d.id} className="px-5 py-3.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar firstName={d.first_name} lastName={d.last_name} size="md" className="rounded-xl shadow shadow-blue-600/20" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{fullName}</p>
                                                <p className="text-xs text-slate-400">{d.specialty ?? '—'} · {d.shift_start ?? '—'}–{d.shift_end ?? '—'} · слот {d.slot_minutes ?? '—'} мин</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${d.is_active ? activeMap.active.className : activeMap.inactive.className}`}>
                                                {d.is_active ? activeMap.active.label : activeMap.inactive.label}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-700">Все записи</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {appointments.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-slate-400 text-sm">Записей пока нет</p>
                                </div>
                            ) : appointments.map(a => {
                                const doc = doctors.find(d => d.id === a.doctor_id)
                                const pat = patients.find(p => p.id === a.patient_id)
                                const docName = doc ? `${doc.last_name ?? ''} ${(doc.first_name ?? '')[0] ?? ''}.`.trim() : 'Врач не найден'
                                const patName = pat ? `${pat.last_name ?? ''} ${(pat.first_name ?? '')[0] ?? ''}.`.trim() : 'Пациент не найден'
                                const timeStr = a.start_time ? new Date(a.start_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
                                const updatedStr = a.updated_at ? new Date(a.updated_at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

                                return (
                                    <div key={a.id} className="px-5 py-3.5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {patName} → {docName}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {doc?.specialty ?? ''} · {timeStr}
                                                <span className="ml-2 text-slate-300">|</span> <span className="text-slate-400">Обновлено: {updatedStr}</span>
                                            </p>
                                            {a.patient_notes && (
                                                <p className="text-xs text-slate-500 mt-0.5">Жалоба: {a.patient_notes}</p>
                                            )}
                                            {a.doctor_notes && (
                                                <p className="text-xs text-green-600 mt-0.5">Запись от врача: {a.doctor_notes}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${progressClass(a.progress)}`}>
                                                {a.progress}
                                            </span>
                                            <button
                                                onClick={() => withErrorToast(() => deleteAppointment(a.id))}
                                                className="text-xs text-red-400 hover:text-red-600 transition cursor-pointer"
                                                title="Отменить запись"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </main>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </>
    )
}

export default function AdminPage() {
    return (
        <AdminProvider>
            <AdminPageContent />
        </AdminProvider>
    )
}
