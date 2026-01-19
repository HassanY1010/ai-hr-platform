import React from 'react'
import { Badge, Button } from '@hr/ui'
import { MoreHorizontal, Eye } from 'lucide-react'
import { formatDate } from '@hr/utils'
import { AuditLog } from '@hr/types'

interface LogTableProps {
    logs: AuditLog[]
    onLogSelect?: (log: AuditLog) => void
    getActionIcon: (action: string) => React.ReactNode
    getSeverityColor: (severity: string) => string
}

export const LogTable: React.FC<LogTableProps> = ({ logs, onLogSelect, getActionIcon, getSeverityColor }) => {
    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'success': return 'success'
            case 'warning': return 'warning'
            case 'error': return 'danger'
            default: return 'neutral'
        }
    }

    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: string, log: AuditLog) => {
        setOpenMenuId(null);
        switch (action) {
            case 'view':
                onLogSelect?.(log);
                break;
            case 'copy-id':
                navigator.clipboard.writeText(log.id);
                // potentially show toast here if toast was imported, but LogTable doesn't import sonner
                break;
            case 'copy-json':
                navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                break;
        }
    };

    return (
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-right text-sm">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">المستخدم</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الإجراء</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الهدف</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الخطورة</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الحالة</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">العنوان IP</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">التاريخ</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {logs.length > 0 ? logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                        {log.user.charAt(0)}
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">{log.user}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                                        {getActionIcon(log.actionType || 'system')}
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300">{log.action}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{log.target}</td>
                            <td className="px-6 py-4">
                                <Badge className={getSeverityColor(log.severity || 'low')}>
                                    {log.severity || 'low'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={getStatusVariant(log.status)}>
                                    {log.status === 'success' ? 'ناجحة' : log.status === 'warning' ? 'تحذير' : 'فشل'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{log.ip}</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-slate-900 dark:text-white">{formatDate(log.timestamp)}</span>
                                    <span className="text-xs text-slate-400">منذ قليل</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-left relative">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAction('view', log)}
                                        className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === log.id ? null : log.id);
                                            }}
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                        </Button>

                                        {openMenuId === log.id && (
                                            <div ref={menuRef} className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col">
                                                <button
                                                    onClick={() => handleAction('view', log)}
                                                    className="text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors w-full"
                                                >
                                                    عرض التفاصيل
                                                </button>
                                                <button
                                                    onClick={() => handleAction('copy-id', log)}
                                                    className="text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors w-full"
                                                >
                                                    نسخ المعرف (ID)
                                                </button>
                                                <button
                                                    onClick={() => handleAction('copy-json', log)}
                                                    className="text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors w-full"
                                                >
                                                    نسخ JSON
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                لا توجد سجلات تطابق عمليات البحث
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
