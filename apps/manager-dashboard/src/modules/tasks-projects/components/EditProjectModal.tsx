import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Save } from 'lucide-react';
import { projectsService, employeeService, ProjectType } from '@hr/services';
import { Button, Input, Textarea } from '@hr/ui';
import { toast } from 'sonner';
import { Employee } from '@hr/types';

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any | null; // Using any for UI compatibility but aligning with ProjectType
    onSuccess?: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        managerId: '',
        deadline: '',
        budget: '',
        priority: 'MEDIUM' as ProjectType['priority'],
        status: 'PLANNING' as ProjectType['status']
    });

    useEffect(() => {
        if (isOpen && project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                managerId: project.managerId || '',
                deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
                budget: project.budget?.toString() || '',
                priority: (project.priority?.toUpperCase() as ProjectType['priority']) || 'MEDIUM',
                status: (project.status?.toUpperCase() as ProjectType['status']) || 'PLANNING'
            });
            loadEmployees();
        }
    }, [isOpen, project]);

    const loadEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Failed to load employees:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;

        try {
            setIsLoading(true);
            await projectsService.update(project.id, {
                name: formData.name,
                description: formData.description,
                managerId: formData.managerId,
                deadline: formData.deadline,
                budget: formData.budget ? parseFloat(formData.budget) : undefined,
                priority: formData.priority,
                status: formData.status
            });
            toast.success('تم تحديث المشروع بنجاح');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Failed to update project:', error);
            toast.error('فشل في تحديث المشروع');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        تعديل المشروع
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المشروع</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="أدخل اسم المشروع"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
                        <Textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="صف المشروع بالتفصيل..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectType['status'] })}
                            >
                                <option value="PLANNING">قيد التخطيط</option>
                                <option value="ACTIVE">نشط</option>
                                <option value="COMPLETED">مكتمل</option>
                                <option value="ON_HOLD">موقوف مؤقتاً</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الأولوية</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectType['priority'] })}
                            >
                                <option value="LOW">منخفضة</option>
                                <option value="MEDIUM">متوسطة</option>
                                <option value="HIGH">عالية</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مدير المشروع</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.managerId}
                                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                            >
                                <option value="">غير معين</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.user?.name || 'Unknown'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموعد النهائي</label>
                            <Input
                                type="date"
                                required
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الميزانية</label>
                        <Input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={onClose}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            leftIcon={<Save className="w-4 h-4 ml-1" />}
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProjectModal;
