import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../content/AuthContext.tsx'
import { useDoctor, DoctorProvider } from '../content/DoctorContext.tsx'
import type { DoctorAppointment } from '../types/doctor.types.ts'
import { progressClass } from '../utils/appointmentStatus.ts'
import { Toast } from '../components/Toast.tsx'
import { useToast } from '../hooks/useToast.ts'
import { MedLogo } from '../components/MedLogo.tsx'
import { UserAvatar } from '../components/UserAvatar.tsx'

const DAY_BITS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
function formatWorkDays(mask: number): string {
    return DAY_BITS.filter((_, i) => mask & (2 << i)).join(', ')
}
function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
function formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
}


function DoctorPageContent() {
    const { logout } = useAuth()
    const { doctor, schedule, appointments, todayAppointments, patients, loading, error, updateNotes } = useDoctor()
    const { toast, showSuccess, hideToast, withErrorToast } = useToast()

    const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'profile'>('today')
    const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null)
    const [notesInput, setNotesInput] = useState('')
    const [savingNotes, setSavingNotes] = useState(false)

    const tabs = [
        { key: 'today',    label: 'Сегодня' },
        { key: 'schedule', label: 'Расписание' },
        { key: 'profile',  label: 'Профиль' },
    ] as const

    const handleSelectAppointment = (a: DoctorAppointment) => {
        setSelectedAppointment(a)
        setNotesInput(a.doctor_notes ?? '')
    }

    const handleSaveNotes = async () => {
        if (!selectedAppointment || savingNotes) return
        const notes = notesInput
        setSavingNotes(true)
        const result = await withErrorToast(() =>
            updateNotes({ appointment_id: selectedAppointment.id, doctor_notes: notes })
                .then(() => true)
        )
        setSavingNotes(false)
        if (result !== undefined) {
            showSuccess('Заметка сохранена')
            setSelectedAppointment(null)
        }
    }

    const doctorFullName = doctor
        ? `${doctor.last_name} ${doctor.first_name} ${doctor.patronymic ?? ''}`.trim()
        : ''

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
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-600/30">
                            <MedLogo />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">МедКабинет</span>
                        <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Врач</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-medium text-slate-700">{doctorFullName}</span>
                            <span className="text-[11px] text-slate-400">{doctor?.specialty}</span>
                        </div>
                        {doctor
                            ? <UserAvatar firstName={doctor.first_name} lastName={doctor.last_name} size="sm" className="rounded-xl shadow shadow-blue-600/20" />
                            : <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">??</div>
                        }
                        <button onClick={() => logout()} className="text-xs text-slate-400 hover:text-red-500 transition cursor-pointer">Выйти</button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">Добрый день, {doctor?.first_name} ️</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Сегодня у вас {todayAppointments.length} приёмов</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: 'Приёмов сегодня',   value: todayAppointments.length, color: 'text-blue-600' },
                        { label: 'Всего записей',     value: appointments.length, color: 'text-indigo-600' },
                        { label: 'Завершенных',       value: appointments.filter(a => a.progress === 'Завершен').length, color: 'text-green-600' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50">
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-1 bg-white/70 rounded-xl p-1 border border-blue-100 mb-5 w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={
                                'px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ' +
                                (activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'today' && (
                    <div className="space-y-3">
                        {todayAppointments.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-blue-50">
                                <p className="text-slate-400 text-sm">На сегодня приёмов нет</p>
                            </div>
                        ) : (
                            todayAppointments.map(a => {
                                const patient = patients.find(p => p.id === a.patient_id)
                                const patientName = patient
                                    ? `${patient.last_name ?? ''} ${patient.first_name ?? ''} ${patient.patronymic ?? ''}`.trim() || 'Пациент'
                                    : 'Пациент не найден'

                                return (
                                <div
                                    key={a.id}
                                    onClick={() => handleSelectAppointment(a)}
                                    className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-blue-50 cursor-pointer hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-14 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">
                                            {a.start_time ? formatTime(a.start_time) : '—'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Пациент: {patientName}
                                            </p>
                                            <p className="text-xs text-slate-400">{a.patient_notes ?? 'Жалоб не указано'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${progressClass(a.progress)}`}>
                                        {a.progress}
                                    </span>
                                </div>
                            )})
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="space-y-3">
                        {schedule ? (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 mb-2">
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Рабочее расписание</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-slate-400 text-xs uppercase">Дни</span>
                                        <p className="font-medium text-slate-700 mt-0.5">{schedule.work_days ? formatWorkDays(schedule.work_days) : '—'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-xs uppercase">Часы</span>
                                        <p className="font-medium text-slate-700 mt-0.5">{schedule.shift_start ?? '—'} — {schedule.shift_end ?? '—'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-xs uppercase">Слот</span>
                                        <p className="font-medium text-slate-700 mt-0.5">{schedule.slot_minutes ? `${schedule.slot_minutes} мин` : '—'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 mb-2">
                                <p className="text-slate-400 text-sm text-center">Расписание не задано</p>
                            </div>
                        )}
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-700">Все записи</h3>
                            </div>
                            {appointments.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-slate-400 text-sm">Записей нет</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {appointments.map(a => {
                                        const patient = patients.find(p => p.id === a.patient_id)
                                        const patientName = patient
                                            ? `${patient.last_name ?? ''} ${patient.first_name ?? ''} ${patient.patronymic ?? ''}`.trim() || 'Пациент'
                                            : 'Пациент не найден'

                                        return (
                                        <div
                                            key={a.id}
                                            onClick={() => handleSelectAppointment(a)}
                                            className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center justify-center h-10 w-14 rounded-xl bg-blue-50 text-blue-700">
                                                    <span className="text-xs font-bold leading-none">{a.start_time ? formatTime(a.start_time) : '—'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        Пациент: {patientName}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {a.patient_notes ?? 'Жалоб не указано'}
                                                        <span className="ml-2 text-slate-300">|</span> <span className="text-slate-400">Обн: {a.updated_at ? formatDateTime(a.updated_at) : '—'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${progressClass(a.progress)}`}>
                                                {a.progress}
                                            </span>
                                        </div>
                                    )})}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    doctor ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 max-w-md space-y-5">
                        <div className="flex items-center gap-4">
                            <UserAvatar firstName={doctor.first_name} lastName={doctor.last_name} size="xl" className="rounded-2xl shadow shadow-blue-600/30" />
                            <div>
                                <p className="font-semibold text-slate-800">{doctorFullName || '—'}</p>
                                <p className="text-sm text-slate-400">{doctor.specialty ?? '—'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Рабочие дни',         value: doctor.work_days ? formatWorkDays(doctor.work_days) : '—' },
                                { label: 'Смена',               value: (doctor.shift_start && doctor.shift_end) ? `${doctor.shift_start} — ${doctor.shift_end}` : '—' },
                                { label: 'Длительность приёма', value: doctor.slot_minutes ? `${doctor.slot_minutes} мин.` : '—' },
                                { label: 'Статус',              value: doctor.is_active ? 'Активен' : 'Неактивен' },
                            ].map(f => (
                                <div key={f.label} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">{f.label}</span>
                                    <span className="text-sm font-medium text-slate-700 wrap-break-word">{f.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center border border-blue-50">
                            <p className="text-slate-400 text-sm">Данные профиля не загружены</p>
                        </div>
                    )
                )}
            </main>

            {selectedAppointment && createPortal(
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Детали приёма</h2>
                        <div className="space-y-3">
                            {(() => {
                                const patient = patients.find(p => p.id === selectedAppointment.patient_id)
                                const patientName = patient
                                    ? `${patient.last_name} ${patient.first_name} ${patient.patronymic ?? ''}`.trim()
                                    : selectedAppointment.patient_id

                                return [
                                    { label: 'Пациент',      value: patientName },
                                    { label: 'Время приёма', value: selectedAppointment.start_time ? formatDateTime(selectedAppointment.start_time) : '—' },
                                    { label: 'Обновлено',    value: selectedAppointment.updated_at ? formatDateTime(selectedAppointment.updated_at) : '—' },
                                    { label: 'Статус',       value: selectedAppointment.progress ?? '—' },
                                    { label: 'Жалоба',       value: selectedAppointment.patient_notes ?? 'Не указана' },
                                ].map(f => (
                                    <div key={f.label} className="flex flex-col gap-0.5">
                                        <span className="text-xs text-slate-400 uppercase tracking-wide">{f.label}</span>
                                        <span className="text-sm font-medium text-slate-700 wrap-break-word">{f.value}</span>
                                    </div>
                                ))
                            })()}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400 uppercase tracking-wide">Заметки врача</span>
                                <textarea
                                    value={notesInput}
                                    onChange={e => setNotesInput(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                                    placeholder="Введите заметки..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Закрыть
                            </button>
                            <button
                                onClick={handleSaveNotes}
                                disabled={savingNotes}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                            >
                                {savingNotes ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </>
    )
}

export default function DoctorPage() {
    return (
        <DoctorProvider>
            <DoctorPageContent />
        </DoctorProvider>
    )
}
