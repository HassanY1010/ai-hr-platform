import React, { useState } from 'react';
import { X, User, Briefcase, Mail, Calendar, TrendingUp, AlertTriangle, Trash2, Edit2, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CheckInStats } from '../CheckInStats';
import { employeeService } from '@hr/services';

interface EmployeeDetailsModalProps {
    employee: any;
    onClose: () => void;
    onSuccess: () => void;
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ employee, onClose, onSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: employee.name || employee.user?.name || '',
        email: employee.email || employee.user?.email || '',
        department: employee.department || '',
        position: employee.position || '',
        status: employee.status || 'active'
    });

    // Sync form data with employee prop if it changes
    React.useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || employee.user?.name || '',
                email: employee.email || employee.user?.email || '',
                department: employee.department || '',
                position: employee.position || '',
                status: employee.status || 'active',
            });
        }
    }, [employee]);

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await employeeService.updateEmployee(employee.id, formData);
            toast.success('تم تحديث بيانات الموظف بنجاح');
            setIsEditing(false);
            onSuccess();
        } catch (err) {
            console.error('Update failed', err);
            toast.error('فشل تحديث البيانات. تأكد من صحة البريد الإلكتروني.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        setIsDeleting(true);
        try {
            await employeeService.deleteEmployee(employee.id);
            toast.success('تم حذف الموظف بنجاح');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('فشل حذف الموظف. يرجى المحاولة لاحقاً.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                {/* Header */}
                <div className="relative h-32 flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                    <button onClick={onClose} className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-12 left-8">
                        <div className="h-24 w-24 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-xl">
                            <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold overflow-hidden">
                                {employee.user?.avatar ? (
                                    <img src={employee.user.avatar} alt={formData.name} className="w-full h-full object-cover" />
                                ) : (
                                    formData.name.charAt(0)
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pt-16 p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-bold dark:text-white">{formData.name}</h3>
                            <p className="text-gray-500">{formData.position}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                                {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">الاسم بالكامل</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <User className="w-4 h-4 text-blue-500" />
                                        <span>{formData.name}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">البريد الإلكتروني</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <span>{formData.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">القسم</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Briefcase className="w-4 h-4 text-blue-500" />
                                        <span>{formData.department}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">الحالة</label>
                                {isEditing ? (
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-blue-500"
                                    >
                                        <option value="active">نشط</option>
                                        <option value="inactive">غير نشط</option>
                                        <option value="suspended">موقف</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-gray-700 dark:text-gray-300">{formData.status === 'active' ? 'نشط' : 'غير نشط'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                            <p className="text-xs text-gray-500 mb-1">تاريخ الانضمام</p>
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <span>{new Date(employee.startDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                            <p className="text-xs text-gray-500 mb-1">الأداء العام</p>
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span>{employee.performanceScore ?? employee.performance ?? 0}%</span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                            <p className="text-xs text-gray-500 mb-1">مستوى الخطورة</p>
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <span>{(employee.riskLevel > 50 || employee.riskLevel === 'high') ? 'عالي' : 'منخفض'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <CheckInStats employeeId={employee.id} />
                    </div>

                    {isEditing && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex gap-3">
                            <button
                                onClick={handleUpdate}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                حفظ التعديلات
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                إلغاء
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
