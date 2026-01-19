import React from 'react'
import { Trash2, Download, Mail, X } from 'lucide-react'
import { Button } from '@hr/ui'

interface BulkActionsProps {
    selectedCount: number
    onClearSelection: () => void
    onExport: () => void
    onMessage?: () => void
}

export const BulkActions: React.FC<BulkActionsProps> = ({
    selectedCount,
    onClearSelection,
    onExport,
    onMessage
}) => {
    return (
        <div className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-indigo-900/20">
            <div className="flex items-center gap-4">
                <button
                    onClick={onClearSelection}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <div>
                    <span className="text-lg font-bold">{selectedCount}</span>
                    <span className="mr-2 text-indigo-100">شركات مختارة</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-white hover:bg-white/10 flex items-center gap-2" onClick={onMessage}>
                    <Mail className="w-4 h-4" />
                    مراسلة
                </Button>
                <Button
                    variant="ghost"
                    onClick={onExport}
                    className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    تصدير
                </Button>
                <div className="w-px h-6 bg-white/20 mx-2" />
                <Button variant="danger" className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 border-none">
                    <Trash2 className="w-4 h-4" />
                    حذف المحدد
                </Button>
            </div>
        </div>
    )
}
