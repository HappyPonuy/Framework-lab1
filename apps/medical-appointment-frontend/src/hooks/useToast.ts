import { useState, useCallback } from 'react'

interface ToastState {
    message: string
    type: 'error' | 'success'
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null)

    const showError = useCallback((message: string) => {
        setToast({ message, type: 'error' })
    }, [])

    const showSuccess = useCallback((message: string) => {
        setToast({ message, type: 'success' })
    }, [])

    const hideToast = useCallback(() => {
        setToast(null)
    }, [])

    const withErrorToast = useCallback(
        async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
            try {
                return await fn()
            } catch (err: unknown) {
                const e = err as { response?: { data?: { error?: string; message?: string } }; message?: string }
                const msg =
                    e?.response?.data?.error ??
                    e?.response?.data?.message ??
                    e?.message ??
                    'Произошла ошибка. Попробуйте ещё раз.'
                showError(msg)
                return undefined
            }
        },
        [showError],
    )

    return { toast, showError, showSuccess, hideToast, withErrorToast }
}

