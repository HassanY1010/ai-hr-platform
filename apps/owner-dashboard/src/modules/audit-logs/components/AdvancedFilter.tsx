import React from 'react'
import { Card, CardContent, Button } from '@hr/ui'

interface AdvancedFilterProps {
    filters: any
    onFiltersChange: (filters: any) => void
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ filters, onFiltersChange }) => {
    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border border-indigo-100 dark:border-indigo-900/30">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="text-sm font-bold mb-2 block text-slate-900 dark:text-white">المستخدم</label>
                        <input
                            placeholder="اسم المستخدم..."
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filters.user}
                            onChange={(e) => onFiltersChange({ ...filters, user: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold mb-2 block text-slate-900 dark:text-white">عنوان IP</label>
                        <input
                            placeholder="192.168..."
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filters.ip}
                            onChange={(e) => onFiltersChange({ ...filters, ip: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold mb-2 block text-slate-900 dark:text-white">الحالة</label>
                        <select
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filters.status}
                            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                        >
                            <option value="all">الكل</option>
                            <option value="success">ناجح</option>
                            <option value="warning">تحذير</option>
                            <option value="error">خطأ</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onFiltersChange({
                                actionType: 'all',
                                severity: 'all',
                                dateRange: 'all',
                                user: '',
                                ip: '',
                                status: 'all'
                            })}
                        >
                            إعادة تعيين الفلاتر
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
