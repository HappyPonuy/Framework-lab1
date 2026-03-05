import React from 'react';

interface UserAvatarProps {
    firstName: string;
    lastName: string;
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName, className = '' }) => {
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
        'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
        'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
        'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
    ];
    const charCode = (firstName.charCodeAt(0) || 0) + (lastName.charCodeAt(0) || 0);
    const bgColor = colors[charCode % colors.length];

    return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold ${bgColor} ${className}`} title={`${firstName} ${lastName}`}>
            {initials}
        </div>
    );
};

