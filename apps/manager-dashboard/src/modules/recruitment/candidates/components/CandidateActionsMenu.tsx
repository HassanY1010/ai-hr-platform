import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Clock, Briefcase, CheckCircle, XCircle } from 'lucide-react'

interface CandidateActionsMenuProps {
    candidate: any
    onUpdateStatus: (candidateId: string, status: string) => void
}

const CandidateActionsMenu: React.FC<CandidateActionsMenuProps> = ({
    candidate,
    onUpdateStatus
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleAction = (status: string) => {
        onUpdateStatus(candidate.id, status)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
                <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-10 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-2 z-50 min-w-[180px] animate-in fade-in zoom-in duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleAction('SCREENING')
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors text-right"
                    >
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>قيد المراجعة</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleAction('INTERVIEWING')
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors text-right"
                    >
                        <Briefcase className="h-4 w-4 text-purple-500" />
                        <span>مقابلة</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleAction('HIRED')
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-right font-medium"
                    >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>قبول</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleAction('REJECTED')
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-right font-medium"
                    >
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>رفض</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default CandidateActionsMenu
