import { useState } from 'react'
import { useAuth } from '../content/AuthContext.tsx'
import { useDoctor, DoctorProvider } from '../content/DoctorContext.tsx'
import type { DoctorAppointment } from '../types/doctor.types.ts'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
function formatWorkDays(mask: number): string {
    return DAY_NAMES.filter((_, i) => mask & (1 << i)).join(', ')
}

function MedLogo() {
    return (
        <svg className="h-6 w-6" viewBox="0 0 473.931 473.931" xmlns="http://www.w3.org/2000/svg">
            <circle fill="#49A0AE" cx="236.966" cy="236.966" r="236.966" />
            <path fill="#996B33" d="M239.132,427.882c0,4.954-0.819,8.973-1.833,8.973l0,0c-1.022,0-1.841-4.019-1.841-8.973l-11.861-383.04c0-4.95,6.133-8.973,13.702-8.973l0,0c7.562,0,13.695,4.022,13.695,8.973L239.132,427.882z" />
            <path fill="#A77640" d="M237.299,436.858L237.299,436.858c-1.022,0-1.841-4.019-1.841-8.973l-11.861-383.04c0-4.95,6.133-8.973,13.702-8.973l0,0L237.299,436.858L237.299,436.858z" />
            <path fill="#74BB4D" d="M264.617,267.064c-42.824-18.829-41.159-32.273-39.756-45.369c1.489-13.927,17.122-20.815,23.693-23.693c9.983-4.363,28.737-10.784,35.24-13.096c33.275-11.854,44.587-54.244,1.792-76.493c-6.204-3.225-15.873-7.263-27.442-11.839c-5.56-2.196-16.976,9.762-9.399,12.595c0.745,0.273,2.866,4.251,3.551,4.658c44.594,26.484,20.587,56.111,1.456,60.373c-0.116-0.052-66.921,12.576-67.557,44.392c-0.621,30.858,8.924,42.753,52.078,60.789c6.701,2.799,12.767,12.535,11.379,27.902c-1.527,16.89-5.16,25.212-12.352,28.583c-19.959,9.354-38.009,22.211-38.009,49.84c0,38.267,74.446,40.145,74.446,40.145s7.177,1.602,7.951-3.042c0.468-2.806-1.949-3.427-1.949-3.427s-49.893,3.349-49.893-34.918c0-27.633,12.834-31.88,37.418-47.401C292.213,321.316,288.19,277.429,264.617,267.064z" />
            <path fill="#996B33" d="M245.774,214.515c-2.339,0-5.276,0-8.479,0l0,0v-52.957l0,0c3.895,0,7.416,0,9.908,0L245.774,214.515z" />
            <path fill="#A77640" d="M237.299,214.515L237.299,214.515c-3.244,0-6.219,0-8.565,0l-1.616-52.957h10.181l0,0V214.515z" />
            <path fill="#996B33" d="M241.018,363.763c-1.182,0-2.432,0-3.719,0l0,0V330.45v0.153c1.579,0,3.106-0.153,4.524-0.153L241.018,363.763z" />
            <path fill="#A77640" d="M237.299,363.763L237.299,363.763c-1.358,0-2.462,2.78-3.697,2.78l-1.014-30.675h4.715l0,0v27.895H237.299z" />
            <circle fill="#A77640" cx="237.34" cy="53.937" r="19.955" />
            <path fill="#996B33" d="M257.287,53.937c0,11.019-8.939,19.959-19.959,19.959v-39.91C248.348,33.986,257.287,42.918,257.287,53.937z" />
            <path fill="#CC4028" d="M229.684,115.852c-7.843,2.17-15.596,3.689-21.945,3.689c-7.446,0-12.554-8.408-20.527-19.034c0,0,4.288,0.202,9.538,3.742l2.859-7.764c0,0,2.324,6.065,1.227,10.627c0,0,2.069,7.109,9.601,7.368c2.814,0.09,7.124-0.737,12.913-2.223C233.441,109.671,249.239,110.434,229.684,115.852z" />
            <path fill="#74BB4D" d="M249.804,94.962c-13.916-0.37-31.958,7.914-32.187,15.442c-0.206,7.517,17.987,14.125,31.891,14.458c13.908,0.37,18.308-5.624,18.525-13.149c0.03-1.272-0.543-4.793-0.73-5.336C265.601,101.432,260.232,95.228,249.804,94.962z" />
            <circle fill="#555C49" cx="244" cy="104.807" r="4.209" />
        </svg>
    )
}

function DoctorPageContent() {
    const { logout } = useAuth()
    const { doctor, schedule, appointments, todayAppointments, loading, error, updateNotes } = useDoctor()

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
        setNotesInput(a.doctorNotes ?? '')
    }

    const handleSaveNotes = async () => {
        if (!selectedAppointment) return
        setSavingNotes(true)
        try {
            await updateNotes({ appointmentId: selectedAppointment.id, doctorNotes: notesInput })
            setSelectedAppointment(prev => prev ? { ...prev, doctorNotes: notesInput } : null)
        } finally {
            setSavingNotes(false)
        }
    }

    const doctorFullName = doctor
        ? `${doctor.lastName} ${doctor.firstName} ${doctor.patronymic ?? ''}`.trim()
        : ''
    const doctorInitials = doctor
        ? `${doctor.lastName[0]}${doctor.firstName[0]}`
        : '??'

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
                            <span className="text-[11px] text-slate-400">{doctor?.specialtyName}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            {doctorInitials}
                        </div>
                        <button onClick={() => logout()} className="text-xs text-slate-400 hover:text-red-500 transition">Выйти</button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">Добрый день, {doctor?.firstName} 👨‍⚕️</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Сегодня у вас {todayAppointments.length} приёма</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: 'Приёмов сегодня',   value: todayAppointments.length, color: 'text-blue-600' },
                        { label: 'Всего записей',     value: appointments.length, color: 'text-indigo-600' },
                        { label: 'С заметками врача', value: appointments.filter(a => a.doctorNotes).length, color: 'text-green-600' },
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
                                'px-4 py-1.5 rounded-lg text-sm font-medium transition ' +
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
                                const dt = new Date(a.startTime)
                                const timeStr = dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                                const patientName = `${a.patientLastName} ${a.patientFirstName} ${a.patientPatronymic ?? ''}`.trim()
                                const age = new Date().getFullYear() - new Date(a.patientBirthDate).getFullYear()
                                return (
                                    <div
                                        key={a.id}
                                        onClick={() => handleSelectAppointment(a)}
                                        className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-blue-50 cursor-pointer hover:shadow-md transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">
                                                {timeStr}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{patientName}</p>
                                                <p className="text-xs text-slate-400">{age} лет · {a.patientNotes ?? '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="space-y-3">
                        {schedule && (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 mb-2">
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Рабочее расписание</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-400 text-xs uppercase">Дни</span><p className="font-medium text-slate-700 mt-0.5">{formatWorkDays(schedule.workDays)}</p></div>
                                    <div><span className="text-slate-400 text-xs uppercase">Часы</span><p className="font-medium text-slate-700 mt-0.5">{schedule.startTime} — {schedule.endTime}</p></div>
                                    <div><span className="text-slate-400 text-xs uppercase">Слот</span><p className="font-medium text-slate-700 mt-0.5">{schedule.slotMinutes} мин</p></div>
                                </div>
                            </div>
                        )}
                        {appointments.map(a => {
                            const dt = new Date(a.startTime)
                            const dateStr = dt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
                            const timeStr = dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                            const patientName = `${a.patientLastName} ${a.patientFirstName}`.trim()
                            return (
                                <div key={a.id} className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-blue-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center h-10 w-14 rounded-xl bg-blue-50 text-blue-700">
                                            <span className="text-xs font-bold leading-none">{timeStr}</span>
                                            <span className="text-[10px] text-blue-400 leading-none mt-0.5">{dateStr}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{patientName}</p>
                                            <p className="text-xs text-slate-400">{a.patientNotes ?? '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {activeTab === 'profile' && doctor && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 max-w-md space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow shadow-blue-600/30">
                                {doctorInitials}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{doctorFullName}</p>
                                <p className="text-sm text-slate-400">{doctor.specialtyName}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Специальность', value: doctor.specialtyName },
                                { label: 'Заметки', value: doctor.notes ?? '—' },
                                { label: 'Статус', value: doctor.isActive ? 'Активен' : 'Неактивен' },
                            ].map(f => (
                                <div key={f.label} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">{f.label}</span>
                                    <span className="text-sm font-medium text-slate-700">{f.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Детали приёма</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Пациент', value: `${selectedAppointment.patientLastName} ${selectedAppointment.patientFirstName} ${selectedAppointment.patientPatronymic ?? ''}`.trim() },
                                { label: 'Возраст', value: `${new Date().getFullYear() - new Date(selectedAppointment.patientBirthDate).getFullYear()} лет` },
                                { label: 'Дата и время', value: new Date(selectedAppointment.startTime).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) },
                                { label: 'Жалоба', value: selectedAppointment.patientNotes ?? '—' },
                            ].map(f => (
                                <div key={f.label} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">{f.label}</span>
                                    <span className="text-sm font-medium text-slate-700">{f.value}</span>
                                </div>
                            ))}
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
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Закрыть
                            </button>
                            <button
                                onClick={handleSaveNotes}
                                disabled={savingNotes}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {savingNotes ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function DoctorPage() {
    return (
        <DoctorProvider>
            <DoctorPageContent />
        </DoctorProvider>
    )
}
