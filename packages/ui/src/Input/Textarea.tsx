import { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => (
    <textarea
        className={`border border-neutral-200 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 transition-all ${className}`}
        {...props}
    />
);
