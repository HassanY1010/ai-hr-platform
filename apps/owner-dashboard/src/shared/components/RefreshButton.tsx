import React from 'react'
import { RefreshCw } from 'lucide-react'

interface RefreshButtonProps {
    onClick: () => void
    isLoading?: boolean
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, isLoading }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
    )
}
