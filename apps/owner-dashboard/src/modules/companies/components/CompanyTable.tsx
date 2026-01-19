import React from 'react'
import { Badge, Button } from '@hr/ui'
import { Edit, Trash2, Globe, MoreHorizontal } from 'lucide-react'
import { Company } from '../types'
import { formatCurrency } from '@hr/utils'

interface CompanyTableProps {
    companies: Company[]
    onEdit: (company: Company) => void
    onDelete: (id: string) => void
    onToggleStatus?: (company: Company) => void
    selectedIds: string[]
    onSelectAll: (checked: boolean) => void
    onSelectItem: (id: string) => void
    onViewPlatform?: (company: Company) => void
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
    companies,
    onEdit,
    onDelete,
    onToggleStatus,
    selectedIds,
    onSelectAll,
    onSelectItem,
    onViewPlatform
}) => {
    const toggleSelectAll = () => {
        if (selectedIds.length === companies.length) {
            onSelectAll(false)
        } else {
            onSelectAll(true)
        }
    }

    const toggleSelect = (id: string) => {
        onSelectItem(id)
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === companies.length && companies.length > 0}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                        </th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الشركة</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الصناعة</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الباقة</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الموظفين</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الإيرادات</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">الحالة</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {companies.map((company) => (
                        <tr key={company.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                            <td className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(company.id)}
                                    onChange={() => toggleSelect(company.id)}
                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                        {company.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white">{company.name}</span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {company.domain}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{company.industry}</td>
                            <td className="px-6 py-4">
                                <Badge variant="outline" className="uppercase font-mono">
                                    {company.subscription.plan}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-mono">{company.userCount}</td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                {formatCurrency(company.subscription.monthlyRevenue)}
                            </td>
                            <td className="py-4 px-4">
                                <Badge
                                    variant={company.status === 'active' ? 'success' : 'warning'}
                                    className="cursor-pointer"
                                    onClick={() => onToggleStatus?.(company)}
                                >
                                    {company.status === 'active' ? 'نشط' : 'معلق'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(company)}>
                                        <Edit className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onDelete(company.id)}>
                                        <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onViewPlatform?.(company)}>
                                        <Globe className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
