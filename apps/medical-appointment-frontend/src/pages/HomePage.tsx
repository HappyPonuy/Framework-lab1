import { useState } from 'react'


const doctors = [
    { id: 1, name: 'Иванов Александр Петрович', specialty: 'Терапевт', rating: 4.9, experience: 15, avatar: 'ИА', available: true },
    { id: 2, name: 'Смирнова Елена Викторовна', specialty: 'Кардиолог', rating: 4.8, experience: 12, avatar: 'СЕ', available: true },
    { id: 3, name: 'Козлов Дмитрий Сергеевич', specialty: 'Невролог', rating: 4.7, experience: 20, avatar: 'КД', available: false },
    { id: 4, name: 'Новикова Анна Игоревна', specialty: 'Офтальмолог', rating: 4.9, experience: 8, avatar: 'НА', available: true },
]

const appointments = [
    { id: 1, doctor: 'Иванов А.П.', specialty: 'Терапевт', date: '27 фев 2026', time: '10:30', status: 'upcoming' },
    { id: 2, doctor: 'Смирнова Е.В.', specialty: 'Кардиолог', date: '5 мар 2026', time: '14:00', status: 'upcoming' },
    { id: 3, doctor: 'Козлов Д.С.', specialty: 'Невролог', date: '10 янв 2026', time: '11:00', status: 'completed' },
]

const statusMap = {
    upcoming: { label: 'Предстоит', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
    completed: { label: 'Завершён', className: 'bg-green-50 text-green-700 border border-green-200' },
    cancelled: { label: 'Отменён', className: 'bg-red-50 text-red-600 border border-red-200' },
}


export default function HomePage() {
    const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'profile'>('appointments')
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')

    const user = { fio: 'Петров Алексей Иванович', email: 'petrov@mail.ru' }

    const tabs = [
        { key: 'appointments', label: 'Мои записи' },
        { key: 'doctors', label: 'Врачи' },
        { key: 'profile', label: 'Профиль' },
    ] as const

    const handleBook = (doctor: typeof doctors[0]) => {
        setSelectedDoctor(doctor)
        setShowBookingModal(true)
    }

    return (
        <div className="min-h-screen bg-[#dbeafe]">

            <header className="bg-white border-b border-blue-100 shadow-sm shadow-blue-900/5">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-600/30">
                            <svg
                                className="h-6 w-6"
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

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-medium text-slate-700">{user.fio}</span>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white">
                            ПА
                        </div>
                        <button className="text-xs text-slate-400 hover:text-red-500 transition">
                            Выйти
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">
                        Добро пожаловать, {user.fio.split(' ')[1]} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Управляйте своими записями к врачу
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: 'Предстоящих', value: appointments.filter(a => a.status === 'upcoming').length, color: 'text-blue-600' },
                        { label: 'Завершённых', value: appointments.filter(a => a.status === 'completed').length, color: 'text-green-600' },
                        { label: 'Врачей доступно', value: doctors.filter(d => d.available).length, color: 'text-indigo-600' },
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
                                (activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700')
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
                            appointments.map(a => (
                                <div key={a.id} className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-blue-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{a.doctor}</p>
                                            <p className="text-xs text-slate-400">{a.specialty} · {a.date} в {a.time}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMap[a.status as keyof typeof statusMap].className}`}>
                    {statusMap[a.status as keyof typeof statusMap].label}
                  </span>
                                </div>
                            ))
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
                        {doctors.map(doctor => (
                            <div key={doctor.id} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow shadow-blue-600/20">
                                        {doctor.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{doctor.name}</p>
                                        <p className="text-xs text-slate-400">{doctor.specialty} · {doctor.experience} лет опыта</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-semibold text-slate-700">{doctor.rating}</span>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${doctor.available ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    {doctor.available ? 'Доступен' : 'Недоступен'}
                  </span>
                                </div>

                                <button
                                    onClick={() => handleBook(doctor)}
                                    disabled={!doctor.available}
                                    className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Записаться
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 max-w-md space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow shadow-blue-600/30">
                                ПА
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{user.fio}</p>
                                <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'ФИО', value: user.fio },
                                { label: 'Email', value: user.email },
                                { label: 'Дата рождения', value: '15 марта 1995' },
                                { label: 'Телефон', value: '+7 (999) 123-45-67' },
                            ].map(field => (
                                <div key={field.label} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">{field.label}</span>
                                    <span className="text-sm font-medium text-slate-700">{field.value}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full rounded-xl border border-blue-200 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition">
                            Редактировать профиль
                        </button>
                    </div>
                )}
            </main>

            {showBookingModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Запись к врачу</h2>
                        <p className="text-sm text-slate-500 mb-5">{selectedDoctor.name} · {selectedDoctor.specialty}</p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Дата</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Время</label>
                                <select
                                    value={selectedTime}
                                    onChange={e => setSelectedTime(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                >
                                    <option value="">Выберите время</option>
                                    {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
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
                                onClick={() => {
                                    alert(`Записано к ${selectedDoctor.name} на ${selectedDate} в ${selectedTime}`)
                                    setShowBookingModal(false)
                                }}
                                disabled={!selectedDate || !selectedTime}
                                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Подтвердить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
