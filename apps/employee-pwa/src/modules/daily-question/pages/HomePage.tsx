import React, { useState, useEffect } from 'react';
import { apiClient } from '@hr/services';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyQuestionStore } from '../store';
import { useEmployeeStore } from '../../../store/employee.store';
import { employeeService } from '@hr/services';
import { QuestionWizard } from '../components/QuestionWizard';
import { useAuth } from '../../../providers/AuthProvider';
import { Link } from 'react-router-dom';
import { SmartSearch } from '../../../components/SmartSearch';
import {
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  Quote,
  ListTodo,
  GraduationCap
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { hasCompletedToday } = useDailyQuestionStore();

  const { tasks, trainings, setTasks, setTrainings } = useEmployeeStore();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    // Load Dashboard Data
    const loadData = async () => {
      if (user?.id) {
        try {
          const results = await Promise.allSettled([
            employeeService.getTasks(user.id, { status: 'TODO' }),
            employeeService.getTrainings(user.id)
          ]);

          const fetchedTasks = results[0].status === 'fulfilled' ? results[0].value : [];
          const fetchedTrainings = results[1].status === 'fulfilled' ? results[1].value : [];

          if (results[0].status === 'rejected') console.error('Tasks fetch failed', results[0].reason);
          if (results[1].status === 'rejected') console.error('Training fetch failed', results[1].reason);

          setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
          setTrainings(Array.isArray(fetchedTrainings) ? fetchedTrainings : []);
        } catch (e) {
          console.error('Unexpected error loading dashboard data', e);
          setTasks([]);
          setTrainings([]);
        }
      }
    };
    loadData();
  }, [user, setTasks, setTrainings]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'طاب مساؤك';
  };

  const activeTasks = Array.isArray(tasks) ? tasks.filter(t => t.status !== 'completed' && t.status !== 'done').length : 0;
  const activeTraining = Array.isArray(trainings) ? trainings.filter(t => t.status === 'IN_PROGRESS').length : 0;

  return (
    <div className="min-h-screen bg-slate-50 pwa-safe-area pb-24 md:pb-0">
      <main className="max-w-xl md:max-w-full mx-auto px-6 md:px-0 pt-12 pb-20 md:pb-6">
        <AnimatePresence mode="wait">
          {!isWizardOpen ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Header & Greeting */}
              <header className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-wider uppercase">Welcome Back</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {getGreeting()}، {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  أهلاً بك في مساحتك الخاصة.
                </p>
              </header>

              {/* Smart Search */}
              <SmartSearch />

              {/* TEMP: 30x3 Check-in Trigger */}
              <section className="mb-8">
                <button
                  onClick={async () => {
                    try {
                      // Show loading state
                      const promise = apiClient.post('/check-in/trigger');

                      toast.promise(promise, {
                        loading: 'جاري استرجاع الأسئلة...',
                        success: () => {
                          window.dispatchEvent(new Event('check-in-update'));
                          return 'تم بدء التقييم! (30×3)';
                        },
                        error: (err: any) => {
                          // Even if already active (400), we want to open the modal
                          if (err.response?.status === 400) {
                            window.dispatchEvent(new Event('check-in-update'));
                            return 'التقييم جاري بالفعل - تم فتح النافذة';
                          }
                          console.error('Trigger Failed:', err);
                          return err.response?.data?.message || 'فشل البدء';
                        }
                      });

                      await promise;

                    } catch (e) {
                      // Handled by toast.promise
                    }
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>بدء تقييم 30×3 الذكي (AI)</span>
                </button>
              </section>



              {/* Dashboard Widgets (Tasks & Training) */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/tasks" className="block p-1">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors h-full">
                    <div className="bg-blue-100 w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                      <ListTodo className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{activeTasks}</div>
                    <div className="text-sm text-slate-500">مهام معلقة</div>
                  </div>
                </Link>

                <Link to="/training" className="block p-1">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-purple-100 transition-colors h-full">
                    <div className="bg-purple-100 w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{activeTraining}</div>
                    <div className="text-sm text-slate-500">تدريب نشط</div>
                  </div>
                </Link>
              </section>

              {/* Privacy Assurance */}
              <section className="soft-glass p-6 rounded-3xl flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800">الخصوصية أولاً</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    إجاباتك سرية وتستخدم فقط لتحسين بيئة العمل.
                  </p>
                </div>
              </section>

              {/* Quote of the Day */}
              <section className="text-center px-6">
                <Quote className="w-8 h-8 text-indigo-200 mx-auto mb-4" />
                <blockquote className="text-xl font-medium text-slate-700 italic leading-relaxed">
                  "النجاح هو مجموع مجهودات صغيرة تتكرر يوماً بعد يوم."
                </blockquote>
              </section>

              {/* TEMP: 30x3 Check-in Trigger */}

            </motion.div>
          ) : (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pt-4"
            >
              <button
                onClick={() => setIsWizardOpen(false)}
                className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">العودة للرئيسية</span>
              </button>

              <QuestionWizard />

              {hasCompletedToday && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center space-y-4"
                >
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200"
                  >
                    الانتهاء والعودة
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HomePage;