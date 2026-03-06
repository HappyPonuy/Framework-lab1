import { useEffect } from 'react'

interface ToastProps {
    message: string
    type?: 'error' | 'success'
    onClose: () => void
    duration?: number
}

export function Toast({ message, type = 'error', onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const t = setTimeout(onClose, duration)
        return () => clearTimeout(t)
    }, [onClose, duration])

    const styles = type === 'error'
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-green-50 border-green-200 text-green-700'

    const icon = type === 'error'
        ? (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        )
        : (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        )

    return (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium max-w-sm w-full mx-4 ${styles}`}>
            {icon}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}
