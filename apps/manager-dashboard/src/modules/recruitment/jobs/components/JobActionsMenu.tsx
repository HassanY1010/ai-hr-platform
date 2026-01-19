import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, FileText, Archive, Trash2 } from 'lucide-react'
import type { Job } from '@hr/types'

interface JobActionsMenuProps {
    job: Job
    onEdit: (job: Job) => void
    onDuplicate: (job: Job) => void
    onArchive: (jobId: string) => void
    onDelete: (jobId: string) => void
}

const JobActionsMenu: React.FC<JobActionsMenuProps> = ({
    job,
    onEdit,
    onDuplicate,
    onArchive,
    onDelete
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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400"
            >
                <MoreVertical className="h-4 w-4" />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-lg p-2 z-50 min-w-[160px]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(job)
                            setIsOpen(false)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right"
                    >
                        <Edit className="h-4 w-4" />
                        تعديل
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDuplicate(job)
                            setIsOpen(false)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right"
                    >
                        <FileText className="h-4 w-4" />
                        نسخ
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onArchive(job.id)
                            setIsOpen(false)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-right"
                    >
                        <Archive className="h-4 w-4" />
                        أرشفة
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(job.id)
                            setIsOpen(false)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-right"
                    >
                        <Trash2 className="h-4 w-4" />
                        حذف
                    </button>
                </div>
            )}
        </div>
    )
}

export default JobActionsMenu
