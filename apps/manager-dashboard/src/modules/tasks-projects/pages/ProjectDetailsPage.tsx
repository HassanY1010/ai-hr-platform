import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
    ArrowRight,
    Calendar,
    Target,
    Clock,
    DollarSign,
    User,
    ListTodo,
    Plus,
    Activity,
    Edit,
    Trash2,
    ChevronRight,
    Eye,
    CheckCircle,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import { projectsService, tasksService, ProjectType, TaskType } from '@hr/services';
import { Button, LoadingCard } from '@hr/ui';
import { toast } from 'sonner';
import CreateTaskModal from '../components/CreateTaskModal';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<ProjectType | null>(null);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<TaskType | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (id) {
            loadProjectDetails();
        }
    }, [id]);

    const loadProjectDetails = async () => {
        try {
            setIsLoading(true);
            const projectData = await projectsService.getById(id!);
            setProject(projectData);

            // Load tasks for this project
            const allTasks = await tasksService.getAll({ projectId: id });
            setTasks(allTasks);
        } catch (error) {
            console.error('Failed to load project details:', error);
            toast.error('فشل في تحميل تفاصيل المشروع');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
        try {
            await tasksService.delete(taskId);
            toast.success('تم حذف المهمة بنجاح');
            loadProjectDetails();
        } catch (error) {
            toast.error('فشل في حذف المهمة');
        }
    };

    const handleEditTask = (task: TaskType) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleViewTaskDetails = (task: TaskType) => {
        setSelectedTaskDetails(task);
    };


    if (isLoading) return <LoadingCard title="جاري تحميل التفاصيل..." />;
    if (!project) return <div className="p-8 text-center">المشروع غير موجود</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'text-green-600 bg-green-50';
            case 'COMPLETED': return 'text-blue-600 bg-blue-50';
            case 'PLANNING': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600 bg-red-50';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
            case 'LOW': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 p-4">
                    <Button variant="ghost" onClick={() => navigate('/projects')} className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        عودة للقائمة
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mt-8">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(project.status)}`}>
                        <Target className="w-10 h-10" />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h1>
                                <p className="text-gray-500 max-w-2xl">{project.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(project.status)}`}>
                                    {project.status === 'ACTIVE' ? 'نشط' : project.status === 'COMPLETED' ? 'مكتمل' : 'قيد التخطيط'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(project.priority || 'MEDIUM')}`}>
                                    {project.priority || 'MEDIUM'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-xs text-gray-500">تاريخ البدء</div>
                                    <div className="font-bold dark:text-white">
                                        {project.startDate ? new Date(project.startDate).toLocaleDateString('ar-EG') : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-xs text-gray-500">الموعد النهائي</div>
                                    <div className="font-bold dark:text-white">
                                        {project.deadline ? new Date(project.deadline).toLocaleDateString('ar-EG') : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-xs text-gray-500">الميزانية</div>
                                    <div className="font-bold dark:text-white">
                                        {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-xs text-gray-500">المدير</div>
                                    <div className="font-bold dark:text-white">{project.manager?.user.name || 'غير معين'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Risk Analysis & Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-3xl p-8 text-white relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Activity className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6" />
                                تحليل المخاطر (AI)
                            </h3>
                            <button
                                onClick={async () => {
                                    try {
                                        setIsAnalyzing(true);
                                        await projectsService.generateRiskAnalysis(project.id);
                                        toast.success('تم تحديث التحليل بنجاح');
                                        loadProjectDetails();
                                    } catch (err) {
                                        toast.error('فشل في تحديث التحليل');
                                    } finally {
                                        setIsAnalyzing(false);
                                    }
                                }}
                                disabled={isAnalyzing}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                title="تحديث التحليل"
                            >
                                <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <p className="text-indigo-100 max-w-3xl leading-relaxed">
                            {project.aiRecommendation || 'اضغط على زر التحديث للحصول على تحليل AI للمخاطر بناءً على المهام الحالية.'}
                        </p>
                        {project.riskLevel && (
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
                                مستوى المخاطر الحالي:
                                <span className={project.riskLevel === 'HIGH' ? 'text-red-400' : project.riskLevel === 'MEDIUM' ? 'text-orange-400' : 'text-green-400'}>
                                    {project.riskLevel === 'HIGH' ? 'مرتفع' : project.riskLevel === 'MEDIUM' ? 'متوسط' : 'منخفض'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-indigo-600" />
                        آخر التحديثات والنشاطات
                    </h3>
                    <div className="space-y-6">
                        {tasks.filter((t: TaskType) => t.status !== 'pending').slice(0, 4).map((task: TaskType, i: number) => (
                            <div key={task.id} className="flex gap-4 items-start">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {task.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="text-sm dark:text-gray-300">
                                        قام <span className="font-bold">{task.employee?.user.name}</span>
                                        {task.status === 'completed' ? ' بإكمال المهمة ' : ' ببدء المهمة '}
                                        <span className="font-bold underline">"{task.title}"</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        منذ {i + 1} ساعات
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.filter((t: TaskType) => t.status !== 'pending').length === 0 && (
                            <div className="text-center py-8 text-gray-500">لا توجد نشاطات حديثة بعد</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <ListTodo className="w-6 h-6" />
                        المهام المرتبطة ({tasks.length})
                    </h3>
                    <Button variant="outline" size="sm" leftIcon={<Plus />} onClick={() => setIsModalOpen(true)}>
                        مهمة جديدة
                    </Button>
                </div>

                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setTaskToEdit(null);
                    }}
                    projectId={id}
                    onSuccess={loadProjectDetails}
                    taskToEdit={taskToEdit}
                />

                {tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <ListTodo className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد مهام مسجلة لهذا المشروع</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-indigo-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white flex items-center gap-2">
                                            {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            {task.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">{task.description?.substring(0, 70)}...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {task.employee?.user.name || 'غير معين'}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleViewTaskDetails(task)} title="تفاصيل" className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400 hover:text-indigo-600">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleEditTask(task)} title="تعديل" className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400 hover:text-amber-600">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteTask(task.id)} title="حذف" className="p-2 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg text-slate-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Task Details Sidebar/Overlay (Simple version) */}
                        {selectedTaskDetails && (
                            <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm shadow-2xl">
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    className="w-full max-w-lg bg-white dark:bg-gray-900 h-full p-8 shadow-2xl relative"
                                >
                                    <button onClick={() => setSelectedTaskDetails(null)} className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    <div className="mt-12 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                <Target className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black">{selectedTaskDetails.title}</h2>
                                                <p className="text-gray-500">تفاصيل المهمة والمتابعة</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold border-b pb-2">الوصف</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedTaskDetails.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl">
                                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> الموظف</div>
                                                <div className="font-bold">{selectedTaskDetails.employee?.user.name}</div>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl">
                                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> الموعد النهائي</div>
                                                <div className="font-bold">{selectedTaskDetails.dueDate ? new Date(selectedTaskDetails.dueDate).toLocaleDateString('ar-EG') : '-'}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold mb-4">التقدم الحالي</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>نسبة الإنجاز</span>
                                                    <span className="font-bold text-indigo-600">{selectedTaskDetails.progress || 0}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-3">
                                                    <div
                                                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${selectedTaskDetails.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t flex gap-4">
                                            <Button variant="outline" className="flex-1" leftIcon={<Edit />} onClick={() => {
                                                handleEditTask(selectedTaskDetails);
                                                setSelectedTaskDetails(null);
                                            }}>تعديل المهمة</Button>
                                            <Button variant="danger" className="flex-1" leftIcon={<Trash2 />} onClick={() => {
                                                handleDeleteTask(selectedTaskDetails.id);
                                                setSelectedTaskDetails(null);
                                            }}>حذف</Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
