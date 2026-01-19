import React from 'react'
import { Card, CardContent } from '@hr/ui'
import { Search } from 'lucide-react'

interface CompanyFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    filters: {
        industry: string
        size: string
        status: string
        subscription: string
        dateRange: string
    }
    onFiltersChange: (filters: any) => void
    industries: string[]
    sizes: string[]
    subscriptionPlans: string[]
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filters,
    onFiltersChange,
    industries,
    sizes,
    subscriptionPlans
}) => {
    return (
        <Card className="bg-white dark:bg-slate-800 shadow-xl border-none">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="البحث عن شركة (الاسم، المجال، النطاق)..."
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <select
                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={filters.industry}
                            onChange={(e) => onFiltersChange({ ...filters, industry: e.target.value })}
                        >
                            <option value="all">جميع المجالات</option>
                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>

                        <select
                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={filters.size}
                            onChange={(e) => onFiltersChange({ ...filters, size: e.target.value })}
                        >
                            <option value="all">جميع الأحجام</option>
                            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select
                            className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={filters.subscription}
                            onChange={(e) => onFiltersChange({ ...filters, subscription: e.target.value })}
                        >
                            <option value="all">جميع الباقات</option>
                            {subscriptionPlans.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
