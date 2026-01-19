// apps/admin-dashboard/src/modules/system-health/components/ServiceStatusCards.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@hr/ui'
import { Activity, Shield, Database, Server, Cloud } from 'lucide-react'
import { ServiceStatus } from '@hr/types'

interface ServiceStatusCardsProps {
    services: ServiceStatus[]
}

export const ServiceStatusCards: React.FC<ServiceStatusCardsProps> = ({ services }) => {
    return (
        <div className="space-y-4">
            {services.map((service, index) => (
                <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${service.status === 'healthy' ? 'bg-green-100 dark:bg-green-900/30' :
                            service.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                'bg-red-100 dark:bg-red-900/30'
                            }`}>
                            {service.name.toLowerCase().includes('api') ? <Server className={`w-5 h-5 ${service.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`} /> :
                                service.name.toLowerCase().includes('db') || service.name.toLowerCase().includes('base') ? <Database className="w-5 h-5 text-blue-600" /> :
                                    service.name.toLowerCase().includes('auth') || service.name.toLowerCase().includes('security') ? <Shield className="w-5 h-5 text-indigo-600" /> :
                                        service.name.toLowerCase().includes('s3') || service.name.toLowerCase().includes('storage') ? <Cloud className="w-5 h-5 text-cyan-600" /> :
                                            <Activity className="w-5 h-5 text-slate-600" />}
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{service.name}</h4>
                                {service.version && <span className="text-[10px] text-slate-400 font-mono">{service.version}</span>}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 uppercase font-bold">
                                <span>{service.uptime} Uptime</span>
                                <span>•</span>
                                <span>{service.latency}ms Latency</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">الحالة</div>
                            <div className="flex items-center gap-2">
                                <Badge variant={
                                    service.status === 'healthy' ? 'success' :
                                        service.status === 'warning' ? 'warning' :
                                            'danger'
                                }>
                                    {service.status === 'healthy' ? 'يعمل' :
                                        service.status === 'warning' ? 'اضطراب' :
                                            'متوقف'}
                                </Badge>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                        <div className={`w-2 h-2 rounded-full animate-pulse ${service.status === 'healthy' ? 'bg-green-500' :
                            service.status === 'warning' ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`} />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
