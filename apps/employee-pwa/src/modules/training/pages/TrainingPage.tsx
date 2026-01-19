import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTrainingStore } from '../store';
import { useAuth } from '../../../providers/AuthProvider';
import { trainingService } from '@hr/services';
import {
  GraduationCap,
  Clock,
  Target,
  BookOpen,
  Play,
  Search,
  Library
} from 'lucide-react';
import { TrainingDetailsModal } from '../components/TrainingDetailsModal';
import { toast } from 'sonner';

const TrainingPage: React.FC = () => {
  const { user } = useAuth();
  const {
    assignedTrainings,
    availableCourses,
    setAssignedTrainings,
    setAvailableCourses,
    isLoading,
    setLoading
  } = useTrainingStore();

  const [activeTab, setActiveTab] = useState<'my-courses' | 'library'>('my-courses');
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab, user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      if (activeTab === 'my-courses') {
        const response = await trainingService.getEnrolledCourses();
        const data = (response as any)?.data || response || [];
        setAssignedTrainings(Array.isArray(data) ? data : []);
      } else {
        const response = await trainingService.getCourses();
        const data = (response as any)?.data || response || [];
        setAvailableCourses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch trainings', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (item: any) => {
    setSelectedTraining(item);
    setDetailsModalOpen(true);
  };

  const handleAction = async (id: string, currentProgress?: number, score?: number) => {
    // Handle Start Course or Request Enrollment
    if (activeTab === 'my-courses') {
      const enrollment = assignedTrainings.find(t => t.id === id);
      if (!enrollment) return;

      try {
        let nextProgress = (currentProgress || 0);

        if (enrollment.status === 'ASSIGNED' || enrollment.status === 'ACCEPTED') {
          nextProgress = 10;
        } else if (currentProgress !== undefined) {
          nextProgress = Math.min(currentProgress + 10, 100);
        }

        if (currentProgress === 100) nextProgress = 100; // Finalization

        // Optimistic Update: Create the updated object
        const updatedEnrollment = {
          ...enrollment,
          progress: nextProgress,
          status: (nextProgress >= 100 ? 'COMPLETED' : 'IN_PROGRESS') as any
        };

        // 1. Update the store immediately
        setAssignedTrainings(assignedTrainings.map(t =>
          t.id === id ? updatedEnrollment : t
        ));

        // 2. Update the modal state immediately if it's the one currently open
        if (selectedTraining && selectedTraining.id === id) {
          setSelectedTraining(updatedEnrollment);
        }

        // 3. Make the API call in the background
        await trainingService.updateProgress(id, nextProgress, score);

        toast.success(nextProgress >= 100 ? 'تم إكمال التدريب بنجاح!' : 'تم تحديث التقدم');

        if (nextProgress >= 100) {
          setDetailsModalOpen(false);
        }
      } catch (error) {
        console.error('Failed to update training progress', error);
        toast.error('فشل في تحديث التقدم');
        // Optional: Revert state here if needed, but for now we'll stick to error notification
      }
    } else {
      try {
        toast.promise(trainingService.enroll(id), {
          loading: 'جاري تسجيل الطلب...',
          success: 'تم إرسال طلب الالتحاق بنجاح، بانتظار موافقة المدير',
          error: 'فشل في إرسال الطلب'
        });
        setDetailsModalOpen(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredItems = activeTab === 'my-courses'
    ? assignedTrainings.filter(t => (t.course?.title || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : availableCourses.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { label: 'مكتمل', color: 'text-emerald-600 bg-emerald-50' };
      case 'IN_PROGRESS': return { label: 'قيد التنفيذ', color: 'text-amber-600 bg-amber-50' };
      case 'ACCEPTED': return { label: 'مقبول', color: 'text-indigo-600 bg-indigo-50' };
      case 'REJECTED': return { label: 'مرفوض', color: 'text-red-600 bg-red-50' };
      default: return { label: 'معين جديد', color: 'text-blue-600 bg-blue-50' }; // ASSIGNED
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 rounded-b-[2.5rem] shadow-sm mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">أكاديمية التدريب</h1>
            <p className="text-slate-500 text-sm mt-1">طوّر مهاراتك وارتقِ بمسارك المهني</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث عن برنامج تدريبي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl relative">
          <button
            onClick={() => setActiveTab('my-courses')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all relative z-10 ${activeTab === 'my-courses' ? 'text-indigo-600 shadow-sm bg-white' : 'text-slate-500'}`}
          >
            دوراتي
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all relative z-10 ${activeTab === 'library' ? 'text-indigo-600 shadow-sm bg-white' : 'text-slate-500'}`}
          >
            المكتبة العامة
          </button>
        </div>
      </div>

      <main className="px-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-slate-400">جاري تحميل البيانات...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Library className="w-10 h-10" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">لا توجد نتائج</h3>
            <p className="text-slate-500 text-sm">حاول البحث بكلمات أخرى أو تصفح المكتبة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'my-courses' ? (
              // My Courses List
              (filteredItems as any[]).map((item: any, index) => {
                const status = getStatusInfo(item.status);
                if (!item.course) return null;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCardClick(item)}
                    className="bg-white p-5 rounded-[2rem] shadow-sm active:scale-98 transition-transform cursor-pointer border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${status.color}`}>
                        {status.label}
                      </span>
                      {item.status === 'IN_PROGRESS' && (
                        <div className="w-6 h-6 bg-amber-50 rounded-full flex items-center justify-center">
                          <Play className="w-3 h-3 text-amber-600 ml-0.5" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-800 mb-2 leading-snug">{item.course.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.course.provider || 'عام'}
                      </span>
                      {item.course.isFree && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">مجاني</span>}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.course.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.course.duration} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        <span>{item.progress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // Library List
              (filteredItems as any[]).map((item: any, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCardClick(item)}
                  className="bg-white p-5 rounded-[2rem] shadow-sm active:scale-98 transition-transform cursor-pointer border border-slate-100 flex gap-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                    <BookOpen className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {item.category || 'عام'}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.duration} د</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      <TrainingDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        training={selectedTraining}
        type={activeTab === 'my-courses' ? 'assigned' : 'available'}
        onAction={handleAction}
      />
    </div>
  );
};

export default TrainingPage;