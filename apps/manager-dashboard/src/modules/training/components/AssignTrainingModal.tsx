import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Check, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { trainingService, employeeService, fileService } from '@hr/services';
import { toast } from 'sonner';

interface AssignTrainingModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AssignTrainingModal: React.FC<AssignTrainingModalProps> = ({ onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isNewMode, setIsNewMode] = useState(true);
    const [formData, setFormData] = useState({
        employeeId: '',
        trainingId: '',
        title: '',
        description: '',
        category: 'Technical',
        duration: 60,
        attachments: [] as any[]
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [emps, trainingData] = await Promise.all([
                employeeService.getAllEmployees(),
                trainingService.getCourses()
            ]);
            setEmployees(emps);
            setCourses((trainingData as any).data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('فشل في تحميل قائمة الموظفين أو الدورات');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.employeeId) {
            toast.error('يرجى اختيار الموظف');
            return;
        }
        if (!isNewMode && !formData.trainingId) {
            toast.error('يرجى اختيار الدورة');
            return;
        }
        if (isNewMode && !formData.title) {
            toast.error('يرجى إدخال عنوان التدريب');
            return;
        }

        setIsLoading(true);
        try {
            let currentAttachments = [...formData.attachments];

            if (isNewMode && selectedFile) {
                setUploading(true);
                try {
                    const response = await fileService.upload(selectedFile, 'training');
                    const fileData = (response as any).data;
                    currentAttachments.push({
                        name: fileData.name,
                        url: fileData.url,
                        size: fileData.size,
                        mimetype: fileData.mimetype
                    });
                } catch (uploadError) {
                    console.error('File upload failed:', uploadError);
                    toast.error('فشل في رفع الملف، سيتم تعيين التدريب بدونه');
                } finally {
                    setUploading(false);
                }
            }

            await trainingService.assignTraining({
                employeeId: formData.employeeId,
                trainingId: isNewMode ? undefined : formData.trainingId,
                title: isNewMode ? formData.title : undefined,
                description: isNewMode ? formData.description : undefined,
                category: isNewMode ? formData.category : undefined,
                duration: isNewMode ? Number(formData.duration) : undefined,
                attachments: isNewMode ? currentAttachments : undefined
            });
            toast.success('تم تعيين التدريب بنجاح');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to assign training:', error);
            toast.error(error.message || 'فشل في تعيين التدريب');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">تعيين تدريب جديد</h3>
                        <p className="text-sm text-gray-500 mt-1">قم بتخصيص مسار تعليمي لموظفيك</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Employee Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" /> اختر الموظف
                        </label>
                        <select
                            required
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="">اختر الموظف المستهدف...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.user?.name} - {emp.position}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setIsNewMode(true)}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${isNewMode ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            تدريب جديد
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsNewMode(false)}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${!isNewMode ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            دورة موجودة
                        </button>
                    </div>

                    {isNewMode ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عنوان التدريب</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="مثال: أساسيات إدارة المشاريع"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الوصف</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                                    placeholder="اكتب تفاصيل التدريب هنا..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">التصنيف</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none"
                                    >
                                        <option value="Technical">تقني</option>
                                        <option value="Soft Skills">مهارات شخصية</option>
                                        <option value="Management">إداري</option>
                                        <option value="Health & Safety">صحة وسلامة</option>
                                        <option value="Onboarding">تهيئة الموظفين</option>
                                        <option value="Compliance">الامتثال</option>
                                        <option value="Leadership">القيادة</option>
                                        <option value="Technology">التكنولوجيا</option>
                                        <option value="Marketing">التسويق</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">المدة (دقيقة)</label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">المرفقات (اختياري)</label>
                                <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] hover:border-indigo-400 transition-all bg-gray-50/50 dark:bg-gray-800/30">
                                    <label className="flex flex-col items-center justify-center cursor-pointer">
                                        <Upload className="w-10 h-10 text-indigo-400 mb-3" />
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                            {selectedFile ? selectedFile.name : 'اضغط لرفع ملف تدريبي (اختياري)'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">PDF, Word, Image (Max 20MB)</p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-500" /> اختر الدورة
                            </label>
                            <select
                                value={formData.trainingId}
                                onChange={(e) => setFormData({ ...formData, trainingId: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">اختر من الدورات المتاحة...</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || uploading}
                            className="flex-[2] py-4 px-6 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            <span>{isLoading ? (uploading ? 'جاري الرفع...' : 'جاري الحفظ...') : 'حفظ وتعيين التدريب'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
