import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { trainingService } from '@hr/services';
import { LoadingCard } from '@hr/ui';
import { toast } from 'sonner';
import { CourseModal } from './components/CourseModal';

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setIsLoading(true);
        try {
            const response = await trainingService.getCourses();
            // Assuming response.data is the array
            setCourses((response as any).data || []);
        } catch (error) {
            console.error('Failed to load courses:', error);
            toast.error('فشل في تحميل الدورات التدريبية');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الدورة؟ سيتم تعطيلها فقط إذا كان هناك مستخدمين مرتبطين.')) return;

        try {
            await trainingService.deleteTraining(id);
            toast.success('تم حذف الدورة بنجاح');
            loadCourses();
        } catch (error) {
            console.error('Failed to delete course:', error);
            toast.error('فشل في حذف الدورة');
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.provider?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">إدارة الدورات التدريبية</h1>
                    <p className="text-gray-500 mt-1">إدارة المكتبة العامة للدورات التدريبية في النظام</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedCourse(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    إضافة دورة جديدة
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="بحث باسم الدورة أو المصدر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-none rounded-2xl py-4 pr-12 pl-4 text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>

            {isLoading ? <LoadingCard title="جاري تحميل الدورات..." /> : filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                    <p className="text-gray-500">لا توجد دورات تدريبية مطابقة</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {course.status === 'active' ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{course.provider || 'مصدر عام'}</span>
                                        <span>•</span>
                                        <span>{course.duration} دقيقة</span>
                                        <span>•</span>
                                        <span>{course.level || 'مبتدئ'}</span>
                                    </div>
                                    {course.url && (
                                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                                            <ExternalLink className="w-3 h-3" />
                                            رابط الدورة
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                                <button
                                    onClick={() => {
                                        setSelectedCourse(course);
                                        setShowModal(true);
                                    }}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="تعديل"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="حذف"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <CourseModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        course={selectedCourse}
                        onSuccess={() => {
                            setShowModal(false);
                            loadCourses();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CoursesPage;
