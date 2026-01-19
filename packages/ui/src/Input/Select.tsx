import React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children?: React.ReactNode;
    className?: string;
}

export const Select = ({ className = "", children, ...props }: SelectProps) => (
    <select
        className={`border border-neutral-200 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 transition-all ${className}`}
        {...props}
    >
        {children}
    </select>
);
