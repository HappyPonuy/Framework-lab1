import { useState } from 'react'

const allDoctors = [
    { id: 1, fio: 'Иванов Александр Петрович', specialty: 'Терапевт', status: 'active', appointments: 42 },
    { id: 2, fio: 'Смирнова Елена Викторовна', specialty: 'Кардиолог', status: 'active', appointments: 38 },
    { id: 3, fio: 'Козлов Дмитрий Сергеевич', specialty: 'Невролог', status: 'inactive', appointments: 29 },
    { id: 4, fio: 'Новикова Анна Игоревна', specialty: 'Офтальмолог', status: 'active', appointments: 51 },
]

const allUsers = [
    { id: 1, fio: 'Петров Алексей Иванович', email: 'petrov@mail.ru', role: 'patient', registered: '10 янв 2026' },
    { id: 2, fio: 'Сидорова Мария Андреевна', email: 'sidorova@mail.ru', role: 'patient', registered: '15 янв 2026' },
    { id: 3, fio: 'Иванов Александр Петрович', email: 'ivanov@medcab.ru', role: 'doctor', registered: '1 янв 2026' },
    { id: 4, fio: 'Кузнецов Игорь Олегович', email: 'kuzn@mail.ru', role: 'patient', registered: '20 фев 2026' },
]

const allAppointments = [
    { id: 1, patient: 'Петров А.И.', doctor: 'Иванов А.П.', date: '24 фев 2026', time: '09:00', status: 'upcoming' },
    { id: 2, patient: 'Сидорова М.А.', doctor: 'Смирнова Е.В.', date: '24 фев 2026', time: '10:00', status: 'upcoming' },
    { id: 3, patient: 'Кузнецов И.О.', doctor: 'Иванов А.П.', date: '23 фев 2026', time: '11:30', status: 'completed' },
    { id: 4, patient: 'Фёдорова О.Н.', doctor: 'Новикова А.И.', date: '25 фев 2026', time: '09:30', status: 'upcoming' },
]

const statusMap = {
    upcoming:  { label: 'Предстоит', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
    completed: { label: 'Завершён',  className: 'bg-green-50 text-green-700 border border-green-200' },
    cancelled: { label: 'Отменён',   className: 'bg-red-50 text-red-600 border border-red-200' },
    active:    { label: 'Активен',   className: 'bg-green-50 text-green-700 border border-green-200' },
    inactive:  { label: 'Неактивен', className: 'bg-slate-100 text-slate-400 border border-slate-200' },
}

const roleMap = {
    patient: { label: 'Пациент', className: 'bg-blue-50 text-blue-700' },
    doctor:  { label: 'Врач',    className: 'bg-indigo-50 text-indigo-700' },
    admin:   { label: 'Админ',   className: 'bg-amber-50 text-amber-700' },
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'users' | 'appointments'>('overview')

    const tabs = [
        { key: 'overview',     label: 'Обзор' },
        { key: 'doctors',      label: 'Врачи' },
        { key: 'users',        label: 'Пользователи' },
        { key: 'appointments', label: 'Записи' },
    ] as const

    return (
        <div className="min-h-screen bg-[#dbeafe]">

            <header className="bg-white border-b border-blue-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
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
                        <span className="text-sm font-semibold text-slate-800">МедКабинет</span>
                        <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Администратор</span>
                    </div>
                    <button className="text-xs text-slate-400 hover:text-red-500 transition">Выйти</button>
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: 'Всего врачей', value: allDoctors.length, color: 'text-blue-600' },
                                { label: 'Пользователей', value: allUsers.length, color: 'text-indigo-600' },
                                { label: 'Записей всего', value: allAppointments.length, color: 'text-slate-700' },
                                { label: 'Активных врачей', value: allDoctors.filter(d => d.status === 'active').length, color: 'text-green-600' },
                            ].map(s => (
                                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50">
                                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* последние записи */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Последние записи</h3>
                            <div className="space-y-2">
                                {allAppointments.slice(0, 3).map(a => (
                                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{a.patient} → {a.doctor}</p>
                                            <p className="text-xs text-slate-400">{a.date} в {a.time}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMap[a.status as keyof typeof statusMap].className}`}>
                      {statusMap[a.status as keyof typeof statusMap].label}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-700">Все врачи</h3>
                            <button className="text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                                + Добавить
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {allDoctors.map(d => (
                                <div key={d.id} className="px-5 py-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                            {d.fio.split(' ').map(n => n[0]).slice(0,2).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{d.fio}</p>
                                            <p className="text-xs text-slate-400">{d.specialty} · {d.appointments} приёмов</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMap[d.status as keyof typeof statusMap].className}`}>
                      {statusMap[d.status as keyof typeof statusMap].label}
                    </span>
                                        <button className="text-xs text-slate-400 hover:text-blue-600 transition px-2">✎</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-700">Все пользователи</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {allUsers.map(u => (
                                <div key={u.id} className="px-5 py-3.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{u.fio}</p>
                                        <p className="text-xs text-slate-400">{u.email} · зарегистрирован {u.registered}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleMap[u.role as keyof typeof roleMap].className}`}>
                    {roleMap[u.role as keyof typeof roleMap].label}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-700">Все записи</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {allAppointments.map(a => (
                                <div key={a.id} className="px-5 py-3.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{a.patient} → {a.doctor}</p>
                                        <p className="text-xs text-slate-400">{a.date} в {a.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMap[a.status as keyof typeof statusMap].className}`}>
                      {statusMap[a.status as keyof typeof statusMap].label}
                    </span>
                                        <button className="text-xs text-red-400 hover:text-red-600 transition px-1">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
