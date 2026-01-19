import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@hr/ui'

interface ExportButtonProps {
    onExport: (format: 'pdf' | 'excel' | 'csv' | 'json') => void
    className?: string
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport, className = '' }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format: 'pdf' | 'excel' | 'csv' | 'json') => {
        onExport(format);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 ${className}`}
            >
                <Download className="h-4 w-4" />
                تصدير
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                    >
                        تصدير PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                    >
                        تصدير Excel
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                    >
                        تصدير CSV
                    </button>
                </div>
            )}
        </div>
    )
}
