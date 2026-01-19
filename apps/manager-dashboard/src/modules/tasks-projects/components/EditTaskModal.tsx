import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Target, Save, Upload, Paperclip } from 'lucide-react';
import { tasksService, employeeService, projectsService, TaskType, fileService } from '@hr/services';
import { Button, Input, Textarea } from '@hr/ui';
import { toast } from 'sonner';
import { Employee } from '@hr/types';

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskType | null;
    onSuccess?: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        employeeId: '',
        projectId: '',
        priority: 'MEDIUM' as TaskType['priority'],
        status: 'pending' as TaskType['status'],
        dueDate: '',
        estimatedTime: '',
        estimatedTimeUnit: 'HOURS',
        progress: 0,
        attachments: [] as any[]
    });

    useEffect(() => {
        if (isOpen && task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                employeeId: task.employeeId || '',
                projectId: task.projectId || '',
                priority: (task.priority?.toUpperCase() as TaskType['priority']) || 'MEDIUM',
                status: task.status || 'pending',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                estimatedTime: task.estimatedTime?.toString() || '',
                estimatedTimeUnit: (task as any).estimatedTimeUnit || 'HOURS',
                progress: task.progress || 0,
                attachments: task.attachments || []
            });
            setSelectedFile(null);
            loadEmployees();
            loadProjects();
        }
    }, [isOpen, task]);

    const loadEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Failed to load employees:', error);
        }
    };

    const loadProjects = async () => {
        try {
            const data = await projectsService.getAll();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const handleGenerateAI = async () => {
        if (!formData.description) {
            toast.error('يرجى إدخال وصف المهمة أولاً ليقوم الذكاء الاصطناعي بمساعدتك');
            return;
        }

        try {
            setIsGenerating(true);
            const suggestions = await tasksService.generateSuggestions({
                projectId: formData.projectId,
                description: formData.description
            });

            if (suggestions && suggestions.length > 0) {
                const suggestion = suggestions[0];
                setFormData(prev => ({
                    ...prev,
                    title: suggestion.title,
                    description: suggestion.description,
                    estimatedTime: suggestion.estimatedTime.toString(),
                    priority: suggestion.priority as TaskType['priority']
                }));
                toast.success('تم تحسين تفاصيل المهمة بنجاح');
            }
        } catch (error) {
            console.error('AI generation failed:', error);
            toast.error('فشل في تحسين تفاصيل المهمة');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return;

        try {
            setIsLoading(true);

            let currentAttachments = [...formData.attachments];

            // Upload file if selected
            if (selectedFile) {
                setUploading(true);
                try {
                    const response = await fileService.upload(selectedFile, 'tasks');
                    const fileData = (response as any).data;
                    currentAttachments.push({
                        name: fileData.name,
                        url: fileData.url,
                        size: fileData.size,
                        mimetype: fileData.mimetype
                    });
                } catch (uploadError) {
                    console.error('File upload failed:', uploadError);
                    toast.error('فشل في رفع الملف، سيتم تحديث المهمة بدونه');
                } finally {
                    setUploading(false);
                }
            }

            await tasksService.update(task.id, {
                title: formData.title,
                description: formData.description,
                employeeId: formData.employeeId,
                projectId: formData.projectId,
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate,
                estimatedTime: formData.estimatedTime ? parseFloat(formData.estimatedTime) : undefined,
                estimatedTimeUnit: formData.estimatedTimeUnit,
                progress: formData.progress,
                attachments: currentAttachments
            } as any);
            toast.success('تم تحديث المهمة بنجاح');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Failed to update task:', error);
            toast.error('فشل في تحديث المهمة');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        تعديل المهمة
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان المهمة</label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="أدخل عنوان المهمة"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وصف المهمة</label>
                        <div className="flex gap-2">
                            <Textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="صف المهمة بالتفصيل..."
                                rows={3}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-10 p-0 flex items-center justify-center shrink-0 border-blue-200"
                                onClick={handleGenerateAI}
                                disabled={isGenerating}
                            >
                                <Star className={`w-5 h-5 ${isGenerating ? 'animate-spin text-blue-400' : 'text-blue-600'}`} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskType['status'] })}
                            >
                                <option value="pending">قائمة الانتظار</option>
                                <option value="in_progress">قيد التنفيذ</option>
                                <option value="review">قيد المراجعة</option>
                                <option value="completed">مكتمل</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الأولوية</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskType['priority'] })}
                            >
                                <option value="LOW">منخفضة</option>
                                <option value="MEDIUM">متوسطة</option>
                                <option value="HIGH">عالية</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموظف المسؤول</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المشروع</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            >
                                <option value="">بدون مشروع</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ الاستحقاق</label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوقت المقدر</label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={formData.estimatedTime}
                                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                                    placeholder="4.5"
                                    className="flex-1"
                                />
                                <select
                                    className="w-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.estimatedTimeUnit}
                                    onChange={(e) => setFormData({ ...formData, estimatedTimeUnit: e.target.value })}
                                >
                                    <option value="HOURS">ساعات</option>
                                    <option value="DAYS">أيام</option>
                                    <option value="WEEKS">أسابيع</option>
                                    <option value="MONTHS">أشهر</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التقدم (%)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 transition-colors">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {selectedFile ? selectedFile.name : 'اضغط لرفع ملف جديد (اختياري)'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'الحد الأقصى 20 ميجابايت'}
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                            />
                        </label>

                        {formData.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs font-bold text-gray-400 mb-2">المرفقات الحالية:</p>
                                <div className="space-y-2">
                                    {formData.attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Paperclip className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }))}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            disabled={isLoading || uploading}
                        >
                            {isLoading ? (uploading ? 'جاري رفع الملف...' : 'جاري الحفظ...') : 'حفظ التغييرات'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditTaskModal;
