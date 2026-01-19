import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Link as LinkIcon } from 'lucide-react';
import { trainingService } from '@hr/services';
import { toast } from 'sonner';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course?: any;
    onSuccess: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        provider: '',
        category: '',
        url: '',
        duration: 60,
        level: 'beginner',
        language: 'ar',
        skills: ''
    });

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title,
                description: course.description || '',
                provider: course.provider || '',
                category: course.category || '',
                url: course.url || '',
                duration: course.duration || 60,
                level: course.level || 'beginner',
                language: course.language || 'ar',
                skills: course.skills ? (typeof course.skills === 'string' ? JSON.parse(course.skills).join(', ') : '') : ''
            });
        }
    }, [course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

            const payload = {
                ...formData,
                skills: skillsArray
            };

            if (course) {
                await trainingService.updateTraining(course.id, payload);
                toast.success('تم تحديث الدورة بنجاح');
            } else {
                await trainingService.createTraining(payload); // Ensure this method exists in training.service for ADMIN 
                // Wait, createTraining calls /training (POST) which is what we want.
                toast.success('تم إنشاء الدورة بنجاح');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {course ? 'تعديل دورة تدريبية' : 'إضافة دورة جديدة'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الدورة <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="مثال: أساسيات إدارة المشاريع"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none"
                                placeholder="وصف مختصر لمحتوى الدورة..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">المصدر / المنصة</label>
                                <input
                                    type="text"
                                    value={formData.provider}
                                    onChange={e => setFormData({ ...formData, provider: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="مثال: دروب، يوديمي"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="مثال: إدارة، تقنية"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-indigo-500" />
                                رابط الدورة (URL)
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                className="w-full p-4 bg-indigo-50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-left dir-ltr"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">هذا الرابط سيظهر للموظف فقط عند بدء التدريب.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">المدة (دقيقة)</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">المستوى</label>
                                <select
                                    value={formData.level}
                                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                >
                                    <option value="beginner">مبتدئ</option>
                                    <option value="intermediate">متوسط</option>
                                    <option value="consumer">متقدم</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">اللغة</label>
                                <select
                                    value={formData.language}
                                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                >
                                    <option value="ar">العربية</option>
                                    <option value="en">الإنجليزية</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">المهارات المستهدفة (افصل بينها بفاصلة)</label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="مثال: إدارة الوقت، التواصل، القيادة"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
