import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Upload, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { trainingService, fileService } from '@hr/services';
import { toast } from 'sonner';

interface EditTrainingModalProps {
    training: any;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditTrainingModal: React.FC<EditTrainingModalProps> = ({ training, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technical',
        duration: 60,
        url: '',
        provider: '',
        attachments: [] as any[]
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (training) {
            // Safe parsing for attachments
            const safeParseAttachments = (data: any) => {
                if (!data) return [];
                if (Array.isArray(data)) return data;
                try {
                    const parsed = JSON.parse(data);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    console.error('Failed to parse attachments:', e);
                    return [];
                }
            };

            setFormData({
                title: training.title || '',
                description: training.description || '',
                category: training.category || 'Technical',
                duration: training.duration || 60,
                url: training.url || '',
                provider: training.provider || '',
                attachments: safeParseAttachments(training.attachments)
            });
            setSelectedFile(null);
        }
    }, [training]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            let currentAttachments = [...formData.attachments];

            if (selectedFile) {
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
                    toast.error('فشل في رفع الملف، سيتم تحديث التدريب بدونه');
                } finally {
                    setUploading(false);
                }
            }

            await trainingService.updateTraining(training.id, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                duration: Number(formData.duration),
                url: formData.url,
                provider: formData.provider,
                attachments: currentAttachments
            });
            toast.success('تم تحديث التدريب بنجاح');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to update training:', error);
            toast.error(error.message || 'فشل في تحديث التدريب');
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
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">تعديل التدريب</h3>
                        <p className="text-sm text-gray-500 mt-1">تحديث تفاصيل البرنامج التدريبي</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عنوان التدريب</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="مثال: أساسيات إدارة المشاريع"
                                required
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

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رابط خارجي (اختياري)</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                                dir="ltr"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">المرفقات (اختياري)</label>
                            <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] hover:border-indigo-400 transition-all bg-gray-50/50 dark:bg-gray-800/30">
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <Upload className="w-10 h-10 text-indigo-400 mb-3" />
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                        {selectedFile ? selectedFile.name : 'اضغط لرفع ملف تدريبي جديد (اختياري)'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, Word, Image (Max 20MB)</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {formData.attachments.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400">المرفقات الحالية:</p>
                                    {formData.attachments.map((file: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Paperclip className="w-4 h-4 text-indigo-500 shrink-0" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{file.name || file}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }))}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

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
                            <span>{isLoading ? (uploading ? 'جاري الرفع...' : 'جاري الحفظ...') : 'حفظ التعديلات'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
