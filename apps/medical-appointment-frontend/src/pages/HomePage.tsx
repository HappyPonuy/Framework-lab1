import { useState, useMemo } from 'react'
import { useAuth } from '../content/AuthContext.tsx'
import { usePatient, PatientProvider } from '../content/PatientContext.tsx'
import { generateTimeSlots } from '../api/patientApi.ts'
import type { DoctorInfo } from '../types/patient.types.ts'
import { progressClass } from '../utils/appointmentStatus.ts'
import type { CreateAppointmentDto, UpdatePatientDto } from '../types/patient.types.ts'
import { Toast } from '../components/Toast.tsx'
import { useToast } from '../hooks/useToast.ts'
import { MedLogo } from '../components/MedLogo.tsx'
import { UserAvatar } from '../components/UserAvatar.tsx'

function HomePageContent() {
    const { user, logout } = useAuth()
    const { patient, appointments, doctors, loading, error, bookAppointment, cancelAppointment, updateProfile } = usePatient()

    const { toast, showSuccess, hideToast, withErrorToast } = useToast()

    const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'profile'>('appointments')
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [patientNotes, setPatientNotes] = useState('')
    const [booking, setBooking] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState<Omit<UpdatePatientDto, 'birth_date'> & { birth_date: string } | null>(null)
    const [saving, setSaving] = useState(false)

    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

    const timeSlots = useMemo(() => {
        if (!selectedDoctor) return []
        const slots = generateTimeSlots(selectedDoctor.shift_start, selectedDoctor.shift_end, selectedDoctor.slot_minutes)
        if (selectedDate === todayStr) {
            const now = new Date()
            const nowMinutes = now.getHours() * 60 + now.getMinutes()
            return slots.filter(t => {
                const [h, m] = t.split(':').map(Number)
                return h * 60 + m > nowMinutes
            })
        }
        return slots
    }, [selectedDoctor, selectedDate, todayStr])

    const tabs = [
        { key: 'appointments', label: 'Мои записи' },
        { key: 'doctors',      label: 'Врачи' },
        { key: 'profile',      label: 'Профиль' },
    ] as const

    const handleBook = (doctor: DoctorInfo) => {
        setSelectedDoctor(doctor)
        setSelectedDate(todayStr)
        setSelectedTime('')
        setPatientNotes('')
        setShowBookingModal(true)
    }

    const handleConfirmBook = async () => {
        if (!selectedDoctor || !selectedTime || !selectedDate) return
        setBooking(true)
        const result = await withErrorToast(async () => {
            const [hours, minutes] = selectedTime.split(':').map(Number)
            const startTime = new Date(selectedDate)
            startTime.setHours(hours, minutes, 0, 0)
            const dto: CreateAppointmentDto = {
                doctor_id:     selectedDoctor.id,
                start_time:    startTime,
                patient_notes: patientNotes.trim() || null,
            }
            await bookAppointment(dto)
            return true
        })
        setBooking(false)
        if (result !== undefined) {
            setShowBookingModal(false)
            showSuccess('Запись успешно создана')
        }
    }

    const handleCancelAppointment = async (id: string) => {
        await withErrorToast(() => cancelAppointment(id))
    }

    const handleOpenEdit = () => {
        if (!patient) return
        const rawDate = patient.birth_date
        const dateObj = rawDate ? new Date(rawDate) : null
        const birthDateStr = dateObj && !isNaN(dateObj.getTime())
            ? dateObj.toISOString().split('T')[0]
            : ''
        setEditForm({
            email:      patient.email ?? '',
            phone:      patient.phone,
            first_name: patient.first_name ?? '',
            last_name:  patient.last_name ?? '',
            patronymic: patient.patronymic,
            birth_date: birthDateStr,
            gender:     patient.gender,
        })
        setShowEditModal(true)
    }

    const handleSaveProfile = async () => {
        if (!editForm) return
        setSaving(true)
        const result = await withErrorToast(async () => {
            const birthDate = new Date(editForm.birth_date)
            if (isNaN(birthDate.getTime())) throw new Error('Некорректная дата рождения')
            await updateProfile({ ...editForm, birth_date: birthDate })
            return true
        })
        setSaving(false)
        if (result !== undefined) {
            setShowEditModal(false)
            showSuccess('Профиль обновлён')
        }
    }

    const initials = patient
        ? `${patient.last_name[0] ?? ''}${patient.first_name[0] ?? ''}`.toUpperCase()
        : user?.username?.slice(0, 2).toUpperCase() ?? '??'
    const displayName = patient
        ? `${patient.last_name} ${patient.first_name} ${patient.patronymic ?? ''}`.trim()
        : user?.username ?? ''

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

            <header className="bg-white border-b border-blue-100 shadow-sm shadow-blue-900/5">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-600/30">
                            <MedLogo />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 tracking-tight">МедКабинет</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-medium text-slate-700">{displayName}</span>
                            <span className="text-[11px] text-slate-400">{patient?.email ?? ''}</span>
                        </div>
                        {patient
                            ? <UserAvatar firstName={patient.first_name} lastName={patient.last_name} size="sm" className="rounded-xl shadow shadow-blue-600/20" />
                            : <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white">{initials}</div>
                        }
                        <button
                            onClick={() => logout()}
                            className="text-xs text-slate-400 hover:text-red-500 transition"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">
                        Добро пожаловать, {patient?.first_name ?? user?.username}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">Управляйте своими записями к врачу</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: 'Всего записей',    value: appointments.length, color: 'text-blue-600' },
                        { label: 'С заметками врача', value: appointments.filter(a => a.doctor_notes).length, color: 'text-green-600' },
                        { label: 'Врачей доступно',  value: doctors.filter(d => d.is_active).length, color: 'text-indigo-600' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm shadow-blue-900/5 border border-blue-50">
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

                {activeTab === 'appointments' && (
                    <div className="space-y-3">
                        {appointments.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-blue-50">
                                <p className="text-slate-400 text-sm">У вас пока нет записей</p>
                            </div>
                        ) : (
                            appointments.map(a => {
                                    const doc = doctors.find(d => d.id === a.doctor_id)
                                    const doctorName = doc
                                        ? `${doc.last_name ?? ''} ${doc.first_name ?? ''} ${doc.patronymic ?? ''}`.trim() || 'Врач'
                                        : 'Врач не найден'
                                    const specialtyName = doc?.specialty ?? '—'
                                    const startTimeStr = a.start_time
                                        ? new Date(a.start_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                                        : '—'
                                    const isCancellable = a.progress === 'Назначен'

                                    return (
                                        <div key={a.id} className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-blue-50">
                                            <div className="flex items-center gap-4">
                                                {doc
                                                    ? <UserAvatar firstName={doc.first_name} lastName={doc.last_name} size="md" className="rounded-xl shadow shadow-blue-600/20" />
                                                    : <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow shadow-blue-600/20">??</div>
                                                }
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{doctorName}</p>
                                                    <p className="text-xs text-slate-400">{specialtyName} · {startTimeStr}</p>
                                                    {a.patient_notes && (
                                                        <p className="text-xs text-slate-500 mt-0.5">Жалоба: {a.patient_notes}</p>
                                                    )}
                                                    {a.doctor_notes && (
                                                        <p className="text-xs text-green-600 mt-0.5">Заметка врача: {a.doctor_notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center gap-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${progressClass(a.progress)}`}>
                                                    {a.progress}
                                                </span>
                                                {isCancellable && (
                                                    <button
                                                        onClick={() => handleCancelAppointment(a.id)}
                                                        className="text-xs text-red-400 hover:text-red-600 transition px-1 cursor-pointer"
                                                        title="Отменить"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                        )}
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700 transition"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Записаться к врачу
                        </button>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                        {doctors.length === 0 ? (
                            <div className="col-span-2 bg-white rounded-2xl p-8 text-center border border-blue-50">
                                <p className="text-slate-400 text-sm">Врачи не найдены</p>
                            </div>
                        ) : doctors.map(doctor => {
                            return (
                                <div key={doctor.id} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar firstName={doctor.first_name} lastName={doctor.last_name} size="lg" className="rounded-xl shadow shadow-blue-600/20" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {doctor.last_name} {doctor.first_name} {doctor.patronymic ?? ''}
                                            </p>
                                            <p className="text-xs text-slate-400">{doctor.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 text-xs text-slate-500">
                                        <span>🕐 {doctor.shift_start} – {doctor.shift_end}</span>
                                        <span>⏱ слот {doctor.slot_minutes} мин</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${doctor.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                            {doctor.is_active ? 'Доступен' : 'Недоступен'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleBook(doctor)}
                                        disabled={!doctor.is_active}
                                        className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Записаться
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}

                {activeTab === 'profile' && (
                    patient ? (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 max-w-md space-y-5">
                        <div className="flex items-center gap-4">
                            <UserAvatar firstName={patient.first_name} lastName={patient.last_name} size="xl" className="rounded-2xl shadow shadow-blue-600/30" />
                            <div>
                                <p className="font-semibold text-slate-800">{displayName || '—'}</p>
                                <p className="text-sm text-slate-400">{patient.email ?? '—'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Фамилия',        value: patient.last_name ?? '—' },
                                { label: 'Имя',            value: patient.first_name ?? '—' },
                                { label: 'Отчество',       value: patient.patronymic ?? '—' },
                                { label: 'Email',          value: patient.email ?? '—' },
                                { label: 'Телефон',        value: patient.phone ?? '—' },
                                {
                                    label: 'Дата рождения',
                                    value: (() => {
                                        const d = patient.birth_date ? new Date(patient.birth_date) : null
                                        return d && !isNaN(d.getTime())
                                            ? d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : '—'
                                    })(),
                                },
                                { label: 'Пол', value: patient.gender === 'M' ? 'Мужской' : patient.gender === 'F' ? 'Женский' : '—' },
                            ].map(field => (
                                <div key={field.label} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">{field.label}</span>
                                    <span className="text-sm font-medium text-slate-700">{field.value}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleOpenEdit}
                            className="w-full rounded-xl border border-blue-200 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition">
                            Редактировать профиль
                        </button>
                    </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center border border-blue-50">
                            <p className="text-slate-400 text-sm">Данные профиля не загружены</p>
                        </div>
                    )
                )}
            </main>

            {showBookingModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Запись к врачу</h2>
                        <p className="text-sm text-slate-500 mb-5">
                            {selectedDoctor.last_name} {selectedDoctor.first_name} · {selectedDoctor.specialty}
                        </p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Дата</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    min={todayStr}
                                    onChange={e => { setSelectedDate(e.target.value); setSelectedTime('') }}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Время</label>
                                <select
                                    value={selectedTime}
                                    onChange={e => setSelectedTime(e.target.value)}
                                    disabled={!selectedDate}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:opacity-50"
                                >
                                    <option value="">Выберите время</option>
                                    {timeSlots.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Жалоба (необязательно)</label>
                                <textarea
                                    value={patientNotes}
                                    onChange={e => setPatientNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Опишите симптомы..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirmBook}
                                disabled={!selectedDate || !selectedTime || booking}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {booking ? 'Сохранение...' : 'Подтвердить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && editForm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Редактировать профиль</h2>
                        <div className="space-y-3">
                            {([
                                { label: 'Фамилия',  field: 'last_name'  as const, type: 'text' },
                                { label: 'Имя',      field: 'first_name' as const, type: 'text' },
                                { label: 'Отчество', field: 'patronymic' as const, type: 'text' },
                                { label: 'Email',    field: 'email'      as const, type: 'email' },
                                { label: 'Телефон',  field: 'phone'      as const, type: 'tel' },
                                { label: 'Дата рождения', field: 'birth_date' as const, type: 'date' },
                            ] as { label: string; field: keyof UpdatePatientDto; type: string }[]).map(({ label, field, type }) => (
                                <div key={field}>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        value={(editForm[field] as string) ?? ''}
                                        onChange={e => setEditForm(prev => prev ? { ...prev, [field]: e.target.value || null } : prev)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Пол</label>
                                <select
                                    value={editForm.gender}
                                    onChange={e => setEditForm(prev => prev ? { ...prev, gender: e.target.value as 'M' | 'F' } : prev)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                >
                                    <option value="M">Мужской</option>
                                    <option value="F">Женский</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {saving ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </>
    )
}

export default function HomePage() {
    return (
        <PatientProvider>
            <HomePageContent />
        </PatientProvider>
    )
}
