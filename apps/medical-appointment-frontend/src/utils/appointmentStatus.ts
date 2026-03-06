export const progressMap: Record<string, { className: string }> = {
    'Назначен': { className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'Завершен':  { className: 'bg-green-50 text-green-700 border-green-200' },
    'Отменен':   { className: 'bg-red-50 text-red-600 border-red-100' },
}

export function progressClass(progress: string): string {
    return progressMap[progress]?.className ?? 'bg-slate-50 text-slate-500 border-slate-200';
}

export function getInitials(...parts: (string | null | undefined)[]): string {
    return parts
        .map(p => (p ?? '').trim()[0] ?? '')
        .join('')
        .toUpperCase() || '?';
}
