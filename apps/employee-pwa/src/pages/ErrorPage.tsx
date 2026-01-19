import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Home,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  Wifi,
  Server,
  Database,
  Shield,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ErrorPage = () => {
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState({
    code: '500',
    title: 'خطأ في الخادم',
    message: 'عذراً، حدث خطأ غير متوقع في الخادم. فريقنا يعمل على حل المشكلة.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // أنواع الأخطاء المختلفة
  const errorTypes: Record<string, {
    title: string;
    message: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
  }> = {
    '404': {
      title: 'الصفحة غير موجودة',
      message: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      icon: Globe,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    '500': {
      title: 'خطأ في الخادم',
      message: 'عذراً، حدث خطأ غير متوقع في الخادم. فريقنا يعمل على حل المشكلة.',
      icon: Server,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    '503': {
      title: 'الخدمة غير متاحة',
      message: 'الخدمة مؤقتاً غير متاحة بسبب أعمال صيانة.',
      icon: Database,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    'network': {
      title: 'خطأ في الاتصال',
      message: 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
      icon: Wifi,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  };

  // تحديد نوع الخطأ من الـ URL أو الـ state
  useEffect(() => {
    // التحقق من وجود window قبل استخدامه
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorCode = params.get('error') || '500';
      const errorType = errorTypes[errorCode] || errorTypes['500'];

      if (errorType) {
        setErrorDetails({
          code: errorCode,
          title: errorType.title,
          message: errorType.message
        });
      }
    }
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 1000);
  };

  const handleGoHome = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleContactSupport = () => {
    if (typeof window !== 'undefined') {
      window.open('mailto:support@company.com?subject=Error Report&body=Error Code: ' + errorDetails.code, '_blank');
    }
  };

  const ErrorIcon = errorTypes[errorDetails.code]?.icon || AlertTriangle;
  const errorColor = errorTypes[errorDetails.code]?.color || 'text-red-500';
  const errorBgColor = errorTypes[errorDetails.code]?.bgColor || 'bg-red-50';

  // دالة لتوليد معرف عشوائي للطلب
  const generateRequestId = () => {
    return Math.random().toString(36).substring(2, 11).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-40 left-10 animate-bounce">
        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
      </div>
      <div className="absolute top-60 right-40 animate-pulse">
        <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 right-10 animate-bounce delay-1000">
        <div className="h-4 w-4 bg-indigo-500 rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-2xl text-center relative z-10"
      >
        {/* Error Icon with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className={`inline - flex items - center justify - center h - 32 w - 32 rounded - full ${errorBgColor} mb - 6 shadow - lg`}>
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <ErrorIcon className={`h - 16 w - 16 ${errorColor} `} />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            {errorDetails.code}
          </h1>
        </motion.div>

        {/* Error Title */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          {errorDetails.title}
        </motion.h2>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed"
        >
          {errorDetails.message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Home className="h-5 w-5" />
            <span>الصفحة الرئيسية</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h - 5 w - 5 ${isLoading ? 'animate-spin' : ''} `} />
            <span>إعادة المحاولة</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactSupport}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Mail className="h-5 w-5" />
            <span>اتصل بالدعم</span>
          </motion.button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 justify-center">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>ماذا يمكنك أن تفعل؟</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-900 mb-1">تحقق من الأمان</h4>
                <p className="text-gray-600">تأكد من أن اتصالك آمن وموثوق</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-900 mb-1">حدث الصفحة</h4>
                <p className="text-gray-600">حاول تحديث الصفحة بعد بضع دقائق</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-900 mb-1">اتصل بالدعم</h4>
                <p className="text-gray-600">فريق الدعم جاهز لمساعدتك على مدار الساعة</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Details (Collapsible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mx-auto mb-4"
          >
            <span>تفاصيل الخطأ</span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 rounded-xl p-4 text-right overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">كود الخطأ:</span>
                    <span className="mr-2 text-gray-900">{errorDetails.code}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">العنوان:</span>
                    <span className="mr-2 text-gray-900">{errorDetails.title}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">الرسالة:</span>
                    <span className="mr-2 text-gray-900">{errorDetails.message}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">الوقت:</span>
                    <span className="mr-2 text-gray-900">{new Date().toLocaleString('ar-SA')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">الرابط:</span>
                    <span className="mr-2 text-gray-900 break-all">
                      {typeof window !== 'undefined' ? window.location.href : 'غير متاح'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">حالة النظام: متاح</span>
            </div>
            <div className="text-gray-500">
              <span>رقم الطلب: #{generateRequestId()}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
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
              <p className="text-lg font-medium text-gray-900">جاري التحميل...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ErrorPage;