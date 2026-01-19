// apps/manager-dashboard/src/modules/tasks-projects/pages/ProjectsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    CheckCircle2,
    AlertTriangle,
    Plus,
    X,
    History,
    Activity,
    Clock,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import { projectsService, ProjectType } from '@hr/services';
import { Button, Input, Textarea, LoadingCard } from '@hr/ui';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ProjectHistoryModal } from '../components/ProjectHistoryModal';

const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [projectStats, setProjectStats] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New Project Form Data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        deadline: '',
        budget: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const data = await projectsService.getAll() as any;
            setProjects(data.projects);
            setProjectStats(data.stats);
        } catch (error) {
            console.error('Failed to load projects:', error);
            toast.error('فشل في تحميل المشاريع');
        } finally {
            setIsLoading(false);
        }
    };

    const [editingProject, setEditingProject] = useState<ProjectType | null>(null);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const projectData = {
                ...formData,
                priority: formData.priority as 'MEDIUM' | 'HIGH' | 'LOW',
                budget: Number(formData.budget)
            };

            if (editingProject) {
                await projectsService.update(editingProject.id, projectData);
                toast.success('تم تحديث المشروع بنجاح');
            } else {
                await projectsService.create(projectData);
                toast.success('تم إنشاء المشروع بنجاح');
            }

            closeModal();
            loadProjects();
        } catch (error) {
            console.error('Failed to save project:', error);
            toast.error(editingProject ? 'فشل في تحديث المشروع' : 'فشل في إنشاء المشروع');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

        try {
            await projectsService.delete(id);
            toast.success('تم حذف المشروع بنجاح');
            loadProjects();
        } catch (error) {
            console.error('Failed to delete project:', error);
            toast.error('فشل في حذف المشروع');
        }
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({ name: '', description: '', startDate: '', deadline: '', budget: '', priority: 'MEDIUM' });
        setShowCreateModal(true);
    };

    const openEditModal = (project: ProjectType, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
            budget: project.budget ? project.budget.toString() : '',
            priority: project.priority || 'MEDIUM'
        });
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setEditingProject(null);
        setFormData({ name: '', description: '', startDate: '', deadline: '', budget: '', priority: 'MEDIUM' });
    };

    const stats = [
        { label: 'مشاريع جارية', value: projectStats?.total || 0, icon: Activity, color: 'text-indigo-600' },
        { label: 'نشطة', value: projects.filter(p => p.status === 'ACTIVE').length, icon: CheckCircle2, color: 'text-green-600' },
        { label: 'متأخرة', value: projectStats?.delayed || 0, icon: AlertTriangle, color: 'text-orange-600' },
        { label: 'منتهية', value: projectStats?.completed || 0, icon: Clock, color: 'text-blue-600' },
    ];

    const statusSummary = [
        { label: 'مشاريع ناجحة', count: projectStats?.completed || 0, variant: 'success' },
        { label: 'مشاريع قيد التخطيط', count: projectStats?.planning || 0, variant: 'warning' },
        { label: 'مشاريع متأخرة', count: projectStats?.delayed || 0, variant: 'danger' },
    ];

    if (isLoading) return <LoadingCard title="جاري تحميل المشاريع..." />;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">إشراف المشاريع</h1>
                    <p className="text-gray-500 mt-1">متابعة حالة المشاريع الكبرى والتدخل عند الحاجة فقط</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="primary"
                        leftIcon={<Plus />}
                        onClick={openCreateModal}
                    >
                        مشروع جديد
                    </Button>
                    <button
                        onClick={() => setShowHistoryModal(true)}
                        className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold flex items-center gap-2 dark:text-gray-300"
                    >
                        <History className="w-4 h-4" />
                        <span>تاريخ المشاريع</span>
                    </button>
                </div>
            </div>

            {/* Stats & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:border-indigo-100">
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-indigo-900 rounded-[2rem] p-6 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Target className="w-24 h-24" />
                    </div>
                    <h3 className="text-lg font-bold mb-6 relative z-10">مؤشرات الأداء التاريخية</h3>
                    <div className="space-y-4 relative z-10">
                        {statusSummary.map((s, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-indigo-800 pb-3">
                                <span className="text-indigo-200 text-sm">{s.label}</span>
                                <span className={`text-lg font-bold ${s.variant === 'success' ? 'text-green-400' : s.variant === 'warning' ? 'text-orange-400' : 'text-red-400'}`}>{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold px-2 dark:text-white">قائمة المشاريع</h3>
                {projects.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد مشاريع حاليا</p>
                        <Button variant="outline" className="mt-4" onClick={openCreateModal}>إضافة مشروع</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                whileHover={{ x: 4 }}
                                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                                onClick={() => navigate('/projects')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${project.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{project.name}</h4>
                                        <p className="text-xs text-gray-500">{project.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 md:gap-16">
                                    <div className="text-center">
                                        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">التقدم</div>
                                        <div className="font-bold dark:text-white">{project.progress}%</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">الحالة</div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${project.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                            <span className="font-bold capitalize dark:text-gray-200">
                                                {project.status === 'ACTIVE' ? 'نشط' :
                                                    project.status === 'PLANNING' ? 'تخطيط' :
                                                        project.status === 'COMPLETED' ? 'مكتمل' : 'موقوف'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/projects/${project.id}`);
                                            }}
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            title="التفاصيل"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => openEditModal(project, e)}
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="تعديل"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteProject(project.id, e)}
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="حذف"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold dark:text-white">{editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المشروع</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="مثال: تطوير النظام المالي"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ البدء</label>
                                        <Input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموعد النهائي</label>
                                        <Input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الميزانية (اختياري)</label>
                                    <Input
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="وصف مختصر للمشروع وأهدافه..."
                                        rows={3}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={closeModal}
                                    >
                                        إلغاء
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="flex-1"
                                        loading={isSubmitting}
                                    >
                                        {editingProject ? 'حفظ التعديلات' : 'إنشاء المشروع'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {showHistoryModal && (
                    <ProjectHistoryModal
                        onClose={() => setShowHistoryModal(false)}
                    />
                )}
            </AnimatePresence>
        </div >
    );
};

export default ProjectsPage;
