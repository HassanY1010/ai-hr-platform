import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ExternalLink, Calendar, CheckCircle2, Play, Building2, Brain, FileText, Download, TrendingUp, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EmployeeTraining, Training } from '../types';
import { QuizModal } from './QuizModal';

interface TrainingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    training: Training | EmployeeTraining | null;
    type: 'assigned' | 'available';
    onAction?: (id: string, progress?: number, score?: number) => void;
}

export const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({ isOpen, onClose, training, type, onAction }) => {
    if (!isOpen || !training) return null;

    const isAssigned = type === 'assigned';
    const course = isAssigned ? (training as EmployeeTraining).course : (training as Training);
    const assignment = isAssigned ? (training as EmployeeTraining) : null;

    const [showQuiz, setShowQuiz] = React.useState(false);

    // Safe parsing helper for attachments and skills
    const safeParse = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Failed to parse field:', e);
            return [];
        }
    };

    const attachments = safeParse(course.attachments);
    const skills = safeParse(course.skills);

    const statusColors = {
        'ASSIGNED': 'bg-blue-100 text-blue-700',
        'ACCEPTED': 'bg-indigo-100 text-indigo-700',
        'IN_PROGRESS': 'bg-amber-100 text-amber-700',
        'COMPLETED': 'bg-green-100 text-green-700',
        'REJECTED': 'bg-red-100 text-red-700'
    };

    const statusLabels = {
        'ASSIGNED': 'تم التعيين',
        'ACCEPTED': 'مقبول',
        'IN_PROGRESS': 'قيد التنفيذ',
        'COMPLETED': 'مكتمل',
        'REJECTED': 'مرفوض'
    };

    return (
        <>
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <Brain className="w-16 h-16 text-white/20" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">{course.title}</h2>
                                    {isAssigned && assignment && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[assignment.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {statusLabels[assignment.status] || assignment.status}
                                        </span>
                                    )}
                                </div>
                                {course.category && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                        {course.category}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Clock className="w-5 h-5 text-indigo-500" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold">المدة</p>
                                        <p className="text-sm font-bold text-slate-900">{course.duration} دقيقة</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Building2 className="w-5 h-5 text-indigo-500" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold">المزود</p>
                                        <p className="text-sm font-bold text-slate-900">{course.provider || 'داخلي'}</p>
                                    </div>
                                </div>
                                {isAssigned && assignment?.createdAt && !isNaN(new Date(assignment.createdAt).getTime()) && (
                                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Calendar className="w-5 h-5 text-indigo-500" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold">تاريخ التعيين</p>
                                            <p className="text-sm font-bold text-slate-900">
                                                {format(new Date(assignment.createdAt), 'dd MMMM yyyy', { locale: ar })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">عن البرنامج التدريبي</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {course.description || 'لا يوجد وصف متاح.'}
                                    </p>
                                </div>

                                {skills.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">المهارات المكتسبة</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill: string, index: number) => (
                                                <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Smart Daily Plan (AI Generated) */}
                                {isAssigned && assignment?.trainingPlan && (
                                    <div className="mt-6 border-t border-slate-100 pt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Brain className="h-5 w-5 text-indigo-500" />
                                            <span>الخطة التدريبية الذكية</span>
                                        </h3>

                                        <div className="space-y-3">
                                            {(() => {
                                                try {
                                                    const plan = JSON.parse(assignment.trainingPlan!);
                                                    return plan.daily_tasks?.map((task: any, idx: number) => (
                                                        <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                                            <div className="flex flex-col items-center justify-center min-w-[3rem] h-12 bg-white rounded-xl shadow-sm border border-slate-100">
                                                                <span className="text-[10px] text-slate-400 font-bold">اليوم</span>
                                                                <span className="text-xl font-black text-indigo-600">{task.day}</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-slate-800 text-sm mb-1">{task.task || 'مهمة تدريبية'}</h4>
                                                                <p className="text-xs text-slate-500">مدة مقدرة: 20-30 دقيقة</p>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="h-6 w-6 rounded-full border-2 border-slate-200" />
                                                            </div>
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return <p className="text-sm text-red-500">خطأ في تحميل الخطة</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {isAssigned && assignment && (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-end mb-2">
                                            <h4 className="font-bold text-sm text-slate-700">التقدم</h4>
                                            <span className="text-sm font-black text-indigo-600">{assignment.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                                style={{ width: `${assignment.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Attachments Section */}
                                {attachments.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Package className="h-5 w-5 text-indigo-500" />
                                            المرفقات التدريبية ({attachments.length})
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {attachments.map((file: any, i: number) => {
                                                const isString = typeof file === 'string';
                                                const url = isString ? file : file.url;
                                                const name = isString ? `مرفق ${i + 1}` : file.name || `مرفق ${i + 1}`;

                                                return (
                                                    <a
                                                        key={i}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 hover:border-indigo-200 transition-all group"
                                                    >
                                                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors">
                                                            <FileText className="h-5 w-5 text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                                                            <p className="text-[10px] text-slate-500 font-medium">انقر للتحميل</p>
                                                        </div>
                                                        <Download className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors mr-2" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                            {isAssigned ? (
                                assignment?.status === 'COMPLETED' ? (
                                    <button className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>تم إكمال التدريب</span>
                                    </button>
                                ) : (
                                    <div className="flex w-full gap-3">
                                        <button
                                            onClick={() => {
                                                if (course.url) window.open(course.url, '_blank');
                                                if (onAction) onAction(assignment!.id, assignment?.progress === 0 ? 10 : assignment?.progress);
                                            }}
                                            className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                        >
                                            {assignment?.status === 'IN_PROGRESS' ? (
                                                <>
                                                    <TrendingUp className="w-5 h-5" />
                                                    <span>متابعة (فتح الرابط)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-5 h-5" />
                                                    <span>بدء التدريب</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (assignment && assignment.quiz) {
                                                    setShowQuiz(true);
                                                } else if (onAction && assignment) {
                                                    onAction(assignment.id, 100);
                                                }
                                            }}
                                            className="px-6 py-3.5 bg-white border-2 border-green-600 text-green-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>إكمال</span>
                                        </button>
                                    </div>
                                )
                            ) : (
                                <button
                                    onClick={() => onAction && onAction(course.id)}
                                    className="w-full py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    <span>طلب التحاق بهذه الدورة</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>

            {isAssigned && assignment?.quiz && (
                <QuizModal
                    isOpen={showQuiz}
                    onClose={() => setShowQuiz(false)}
                    quizData={assignment.quiz!}
                    onPass={() => {
                        setShowQuiz(false);
                        if (assignment && onAction) onAction(assignment.id, 100);
                    }}
                />
            )}
        </>
    );
};
