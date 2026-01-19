// NotFoundPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  MapPin,
  Compass,
  ArrowLeft,
  Star,
  Zap,
  Navigation,
  Target,
  BookOpen,
  Mail,
  Phone,
  Bell,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExploring, setIsExploring] = useState(false);

  // اقتراحات للصفحات الشائعة
  const commonPages = [
    { name: 'الصفحة الرئيسية', path: '/', icon: Home, description: 'لوحة القيادة الرئيسية' },
    { name: 'الملف الشخصي', path: '/profile', icon: User, description: 'إدارة حسابك الشخصي' },
    { name: 'المهام', path: '/tasks', icon: Target, description: 'مهامك اليومية' },
    { name: 'التدريب', path: '/training', icon: BookOpen, description: 'دورات التطوير المهني' },
    { name: 'الإشعارات', path: '/notifications', icon: Bell, description: 'آخر التحديثات' }
  ];

  // خلفيات متغيرة
  const backgrounds = [
    'from-blue-50 via-purple-50 to-pink-50',
    'from-green-50 via-blue-50 to-indigo-50',
    'from-yellow-50 via-orange-50 to-red-50',
    'from-teal-50 via-cyan-50 to-blue-50'
  ];

  const [currentBg, setCurrentBg] = useState(backgrounds[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => {
        const currentIndex = backgrounds.indexOf(prev);
        return backgrounds[(currentIndex + 1) % backgrounds.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // يمكن إضافة منطق البحث هنا
      navigate('/search?q=' + encodeURIComponent(searchTerm));
    }
  };

  const handleQuickNavigation = (path: string) => {
    setIsExploring(true);
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  // تحقق من أن window موجود (للتشغيل في Node.js)
  const getWindowDimensions = () => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
    return { width: 1000, height: 800 };
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentBg} flex items-center justify-center p-4 relative overflow-hidden transition-all duration-1000`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const { width, height } = getWindowDimensions();
          const iconSize = Math.floor(Math.random() * 3) + 1;

          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * width,
                y: Math.random() * height,
                opacity: 0
              }}
              animate={{
                x: Math.random() * width,
                y: Math.random() * height,
                opacity: Math.random() * 0.5 + 0.2
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Star className={`h-${iconSize} w-${iconSize} text-blue-400`} />
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-4xl text-center relative z-10"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="relative"
            >
              {/* Large 404 Text */}
              <div className="relative">
                <motion.span
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block"
                >
                  404
                </motion.span>

                {/* Decorative Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 text-blue-400"
                >
                  <Zap className="h-8 w-8" />
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -left-4 text-purple-400"
                >
                  <Compass className="h-8 w-8" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            يبدو أنك ضللت الطريق!
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
            دعنا نساعدك في العثور على ما تحتاجه.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                placeholder="ابحث عن صفحة أو خدمة..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                بحث
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto shadow-lg"
              >
                <p className="text-sm text-gray-600 mb-3">اقتراحات سريعة:</p>
                <div className="flex flex-wrap gap-2">
                  {['الرئيسية', 'المهام', 'التدريب', 'الملف الشخصي'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">او انتقل بسرعة إلى:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {commonPages.map((page, index) => {
              const IconComponent = page.icon;
              return (
                <motion.button
                  key={page.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickNavigation(page.path)}
                  disabled={isExploring}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-medium text-gray-900 mb-1">{page.name}</h4>
                  <p className="text-xs text-gray-600">{page.description}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>الرجوع</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            disabled={isExploring}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Home className="h-5 w-5" />
            <span>الصفحة الرئيسية</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Navigation className="h-5 w-5" />
            <span>إعادة التوجيه</span>
          </motion.button>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 justify-center">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>هل ما زلت بحاجة إلى مساعدة؟</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@company.com"
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>support@company.com</span>
            </a>
            <a
              href="tel:+966123456789"
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+966 123 456 789</span>
            </a>
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            💡 <span className="font-medium">نصيحة:</span> استخدام شريط البحث أعلاه يمكن أن يوفر لك الوقت!
          </p>
        </motion.div>
      </motion.div>

      {/* Loading Overlay for Navigation */}
      <AnimatePresence>
        {isExploring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"
              />
              <p className="text-lg font-medium text-gray-900">جاري التوجيه...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotFoundPage;