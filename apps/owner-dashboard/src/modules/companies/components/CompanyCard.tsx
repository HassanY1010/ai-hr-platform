import React from 'react'
import { motion } from 'framer-motion'
import { Building, Globe, Users, Calendar, Trash2, ExternalLink, MapPin } from 'lucide-react'
import { Card, CardContent, Badge, Button } from '@hr/ui'
import { Company } from '../types'
import { formatDate } from '@hr/utils'

interface CompanyCardProps {
    company: Company
    onEdit: (company: Company) => void
    onDelete: (id: string) => void
    onToggleStatus?: (company: Company) => void
    isSelected: boolean
    onSelect: (id: string) => void
    onViewPlatform?: (company: Company) => void
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
    company,
    onEdit,
    onDelete,
    onToggleStatus,
    isSelected,
    onSelect,
    onViewPlatform
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group ${isSelected ? 'ring-2 ring-indigo-500 rounded-2xl' : ''}`}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(company.id)}
                className="absolute top-4 right-4 z-10 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
            />

            <Card className="h-full bg-white dark:bg-slate-800 shadow-lg border-none overflow-hidden">
                <CardContent className="p-0">
                    <div className="h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 p-6 flex items-end">
                        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-700 shadow-xl flex items-center justify-center p-3 border border-slate-100 dark:border-slate-600">
                            <Building className="h-full w-full text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                                    {company.name}
                                </h3>
                                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mt-1">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm font-mono">{company.domain}</span>
                                </div>
                            </div>
                            <Badge
                                variant={company.status === 'active' ? 'success' : 'warning'}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onToggleStatus?.(company)}
                            >
                                {company.status === 'active' ? 'نشط' : 'معلق'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400">الصناعة</p>
                                <p className="text-sm font-semibold">{company.industry}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400">الباقة</p>
                                <p className="text-sm font-semibold uppercase">{company.subscription.plan}</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{company.userCount} موظف</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{formatDate(company.createdAt, 'MMM yyyy')}</span>
                            </div>
                        </div>

                        {company.contact && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mb-6 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                <MapPin className="w-3 h-3" />
                                <span>{company.contact.location}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                onClick={() => onEdit(company)}
                            >
                                تعديل
                            </Button>
                            <Button variant="outline" size="sm" className="px-3" onClick={() => onViewPlatform?.(company)}>
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                onClick={() => onDelete(company.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
