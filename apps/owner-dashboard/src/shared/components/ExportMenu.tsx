import React from 'react'
import { Download } from 'lucide-react'

interface ExportMenuProps {
    onExport?: (format: string) => void
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport }) => {
    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                <Download className="w-4 h-4 text-indigo-500" />
                <span>تصدير</span>
            </button>

            <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-1">
                    {['PDF', 'Excel', 'CSV'].map((format) => (
                        <button
                            key={format}
                            onClick={() => onExport?.(format)}
                            className="w-full text-right px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                        >
                            تصدير كـ {format}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
