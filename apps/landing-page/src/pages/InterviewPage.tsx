import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    Video,
    Send,
    ArrowLeft,
    Brain,
    Clock,
    CheckCircle2,
    Lock,
    ShieldCheck,
    Loader2,
    Smile,
    Heart,
    Star,
    AlertCircle,
    FileText
} from 'lucide-react';
import { recruitmentService } from '@hr/services';
import { toast } from 'sonner';
import { Candidate } from '@hr/types';

const InterviewPage = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);

    // Steps: auth -> terms -> privacy -> intro -> questions -> finishing -> feedback -> done
    const [step, setStep] = useState('auth');
    const [inputCode, setInputCode] = useState(code || '');

    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [completed, setCompleted] = useState(false);

    // Question Phases: READING (30s) -> PREPARING (15s) -> ANSWERING (start recording, 120s max)
    type QuestionPhase = 'READING' | 'PREPARING' | 'ANSWERING';
    const [phase, setPhase] = useState<QuestionPhase>('READING');
    const [timeLeft, setTimeLeft] = useState(30);

    const [isRecording, setIsRecording] = useState(false);

    // Media State
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Feedback State
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        if (code) {
            verifyCode(code);
        } else {
            setLoading(false);
        }
        return () => {
            stopMediaStream();
        };
    }, [code]);

    // Timer Logic
    useEffect(() => {
        if (step !== 'questions') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimerExpiry();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [step, phase, timeLeft]);

    const handleTimerExpiry = () => {
        if (phase === 'READING') {
            setPhase('PREPARING');
            setTimeLeft(15);
        } else if (phase === 'PREPARING') {
            setPhase('ANSWERING');
            setTimeLeft(120); // 2 minutes
            // بدء التسجيل فقط عند السؤال الأول
            if (currentQuestionIdx === 0 && !isRecording) {
                startInterviewRecording();
            }
        } else if (phase === 'ANSWERING') {
            // Time limit reached for answer
            handleNext();
        }
    };

    // Auto-scroll to top when step changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    // Cleanup media on unmount
    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Load questions when entering questions step
    useEffect(() => {
        if (step === 'questions') {
            fetchQuestions();
            startMediaStream();
            // Reset for first question
            setPhase('READING');
            setTimeLeft(30);
        }
    }, [step]);

    const startMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing media devices:", err);
            toast.error("يرجى السماح بالوصول للكاميرا والميكروفون");
        }
    };

    const stopMediaStream = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

    const fetchQuestions = async () => {
        if (!code) return;
        try {
            const fetchedQuestions = await recruitmentService.getInterviewQuestions(code);
            if (fetchedQuestions && fetchedQuestions.length > 0) {
                setQuestions(fetchedQuestions);
            } else {
                setQuestions([
                    "حدثنا عن نفسك وعن أهم خبراتك المهنية.",
                    "لماذا تعتقد أنك المرشح المثالي لهذه الوظيفة؟",
                    "ما هي نقاط القوة التي ستضيفها لفريقنا؟"
                ]);
            }
        } catch (error) {
            console.error(error);
            toast.error("فشل تحميل الأسئلة، يرجى المحاولة مرة أخرى");
        }
    };

    const verifyCode = async (c: string) => {
        setLoading(true);
        try {
            const data = await recruitmentService.getCandidateByCode(c);
            setCandidate(data);
            setStep('auth-success'); // Intermediate state to decide next

            // If already accepted terms? For now, we ask every time for demo purposes
            // Or assume New session -> Go to Terms
            setTimeout(() => setStep('terms'), 500);

        } catch (error) {
            toast.error('رمز المقابلة غير صحيح أو منتهي الصلاحية');
            setStep('auth');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        // لا نوقف التسجيل، فقط ننتقل للسؤال التالي
        moveToNextQuestion();
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setPhase('READING');
            setTimeLeft(30);
        } else {
            finishInterview();
        }
    };

    const finishInterview = () => {
        setStep('finishing');
        // إيقاف التسجيل وحفظ الفيديو الكامل
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop(); // This will trigger onstop which saves the complete video
        } else {
            // If recording wasn't started, just proceed
            stopMediaStream();
            setTimeout(() => {
                setStep('feedback');
            }, 2000);
        }
    };

    const startInterviewRecording = () => {
        if (!mediaStream) return;

        let mimeType = 'video/webm';
        if (MediaRecorder.isTypeSupported('video/mp4')) {
            mimeType = 'video/mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            mimeType = 'video/webm;codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            mimeType = 'video/webm;codecs=vp8';
        }

        // إعدادات محسّنة للتسجيل الطويل
        const options = {
            mimeType,
            videoBitsPerSecond: 2500000, // 2.5 Mbps - جودة جيدة
        };

        const recorder = new MediaRecorder(mediaStream, options);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
                console.log(`Recorded chunk: ${e.data.size} bytes, Total chunks: ${chunks.length}`);
            }
        };

        recorder.onerror = (event) => {
            console.error('MediaRecorder error:', event);
            toast.error('حدث خطأ في التسجيل');
        };

        recorder.onstop = async () => {
            setIsRecording(false);
            console.log(`Recording stopped. Total chunks: ${chunks.length}`);
            const blob = new Blob(chunks, { type: mimeType });
            console.log(`Final video size: ${blob.size} bytes (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);

            // حفظ الفيديو الكامل مع جميع الأسئلة
            await handleUploadAndSubmit(blob);
            // إيقاف البث بعد الحفظ
            stopMediaStream();
            // الانتقال لصفحة التقييم
            setTimeout(() => {
                setStep('feedback');
            }, 1000);
        };

        // بدء التسجيل مع timeslice لجمع البيانات كل 1 ثانية
        // هذا يضمن عدم فقدان البيانات في التسجيلات الطويلة
        recorder.start(1000); // جمع البيانات كل ثانية
        setMediaRecorder(recorder);
        setIsRecording(true);
        console.log('Recording started with timeslice: 1000ms');
    };

    const handleUploadAndSubmit = async (videoBlob: Blob) => {
        if (!candidate) return;

        // Optimistic UI update or toast
        toast.info('جاري حفظ المقابلة الكاملة...');

        try {
            // 1. Upload Complete Video
            const uploadResponse = await recruitmentService.uploadInterviewVideo(videoBlob, candidate.id);
            const videoUrl = uploadResponse.url;

            // 2. Submit Complete Interview with all questions
            const allQuestionsNotes = questions.map((q, idx) => `السؤال ${idx + 1}: ${q}`).join('\n\n');

            await recruitmentService.submitInterview({
                candidateId: candidate.id,
                videoUrl: videoUrl,
                notes: allQuestionsNotes
            });

            toast.success('تم حفظ المقابلة بنجاح');
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء حفظ المقابلة');
        }
    };

    const submitFeedback = async () => {
        if (!candidate) return;
        try {
            await recruitmentService.submitInterviewFeedback(candidate.id, rating, feedbackText);
            toast.success("شكراً لتقييمك!");
        } catch (err) {
            console.error(err);
            toast.success("شكراً لتقييمك!"); // Show success even if fail (optimistic)
        }
        setStep('done');
        setCompleted(true);
    };

    if (loading) return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-slate-500 font-bold">جاري التحميل...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="font-black text-slate-800 text-lg">المقابلة الذكية</span>
                </div>
                {candidate && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-bold">المرشح:</span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
                            {candidate.name}
                        </span>
                    </div>
                )}
            </div>

            <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* AUTH STEP */}
                    {step === 'auth' && (
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                                <Lock className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">أدخل رمز الدخول</h2>
                            <input
                                type="text"
                                placeholder="X X X X"
                                className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all uppercase"
                                maxLength={8}
                                value={inputCode}
                                onChange={e => setInputCode(e.target.value)}
                            />
                            <button
                                onClick={() => verifyCode(inputCode)}
                                className="btn-premium w-full py-4 text-lg"
                            >
                                دخول
                            </button>
                        </motion.div>
                    )}

                    {/* TERMS STEP */}
                    {step === 'terms' && (
                        <motion.div
                            key="terms"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-2xl bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100"
                        >
                            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-indigo-600" />
                                الشروط والأحكام
                            </h2>
                            <div className="prose prose-slate bg-slate-50 p-6 rounded-2xl mb-8 max-h-[300px] overflow-y-auto text-right">
                                <p className="font-bold text-slate-700">يرجى قراءة الشروط التالية بعناية قبل البدء:</p>
                                <ul className="list-disc pr-5 space-y-2 text-slate-600 font-medium mt-4">
                                    <li>سيتم تسجيل الفيديو والصوت لأغراض التقييم والتوظيف فقط.</li>
                                    <li>سيتم مشاركة التسجيل مع فريق التوظيف في الشركة المعلنة فقط.</li>
                                    <li>قد يتم استخدام تقنيات الذكاء الاصطناعي للمساعدة في تحليل الإجابات، ولكن القرار النهائي بيد مسؤولي التوظيف.</li>
                                    <li>يحق لك التوقف وانسحاب من المقابلة في أي وقت، ولكن قد يؤثر ذلك على اكتمال طلبك.</li>
                                    <li>نلتزم بحماية بياناتك وخصوصيتك وفقاً للأنظمة المعمول بها.</li>
                                </ul>
                            </div>
                            <div className="flex items-center gap-3 mb-8">
                                <input id="terms-check" type="checkbox" className="w-6 h-6 text-indigo-600 rounded-lg border-2 border-slate-300 focus:ring-indigo-500"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            if (candidate) {
                                                recruitmentService.acceptTerms(candidate.id).catch(console.error);
                                            }
                                            setStep('privacy');
                                        }
                                    }}
                                />
                                <label htmlFor="terms-check" className="text-lg font-bold text-slate-800 cursor-pointer select-none">
                                    أوافق على الشروط والأحكام المذكورة أعلاه
                                </label>
                            </div>
                            <p className="text-sm text-slate-400 font-bold">يجب الموافقة للمتابعة</p>
                        </motion.div>
                    )}

                    {/* PRIVACY / INSTRUCTION STEP */}
                    {step === 'privacy' && (
                        <motion.div
                            key="privacy"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-2xl bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 text-center"
                        >
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4">تعليمات الخصوصية</h2>
                            <p className="text-xl text-slate-600 font-medium mb-8 leading-relaxed max-w-lg mx-auto">
                                نحن نحترم خصوصيتك بشكل كامل.
                                <br />
                                <span className="text-indigo-600 font-bold">لا يشترط إظهار الوجه بالكامل</span> في حال رغبتك بذلك.
                                <br />
                                ما يهمنا هو: <span className="font-bold text-slate-800">جودة الصوت ووضوح الإجابة</span>.
                                <br />
                                يمكنك التأكد من إعداداتك في الخطوة التالية.
                            </p>
                            <button
                                onClick={() => setStep('intro')}
                                className="btn-premium px-12 py-4 text-lg"
                            >
                                فهمت، التالي
                            </button>
                        </motion.div>
                    )}

                    {/* INTRO STEP */}
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-3xl bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100 text-center"
                        >
                            <h2 className="text-4xl font-black text-slate-900 mb-6">أهلاً بك م/ {candidate?.name}</h2>
                            <p className="text-xl text-slate-600 font-medium mb-10">
                                سنطرح عليك <span className="font-bold text-indigo-600">5 أسئلة</span>.
                                <br />
                                لكل سؤال، سيكون لديك وقت للقراءة، ووقت للتفكير، ووقت للإجابة.
                            </p>

                            <div className="grid grid-cols-3 gap-6 mb-10">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="font-black text-2xl text-slate-800 mb-1">30 ثانية</div>
                                    <div className="text-sm text-slate-500 font-bold">لقراءة السؤال</div>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <div className="font-black text-2xl text-indigo-600 mb-1">15 ثانية</div>
                                    <div className="text-sm text-indigo-500 font-bold">للتفكير والتحضير</div>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="font-black text-2xl text-emerald-600 mb-1">2 دقيقة</div>
                                    <div className="text-sm text-emerald-500 font-bold">للإجابة (تسجيل)</div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('questions')}
                                className="btn-premium w-full py-5 text-xl flex items-center justify-center gap-3"
                            >
                                <Video className="w-6 h-6" />
                                <span>ابدأ المقابلة والوصول للكاميرا</span>
                            </button>
                        </motion.div>
                    )}

                    {/* QUESTIONS STEP */}
                    {step === 'questions' && (
                        <motion.div
                            key="questions"
                            className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start"
                        >
                            {/* Camera Feed */}
                            <div className="bg-black rounded-3xl overflow-hidden aspect-video relative shadow-2xl">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    {isRecording ? (
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                            جاري التسجيل
                                        </div>
                                    ) : (
                                        <div className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full" />
                                            استعداد
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Question & Timer Panel */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 min-h-[500px] flex flex-col">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-sm font-bold text-slate-400">
                                        السؤال {currentQuestionIdx + 1} من {questions.length}
                                    </span>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${phase === 'READING' ? 'bg-slate-100 text-slate-600' :
                                        phase === 'PREPARING' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {phase === 'READING' && 'وقت القراءة'}
                                            {phase === 'PREPARING' && 'وقت التفكير'}
                                            {phase === 'ANSWERING' && 'وقت الإجابة'}
                                        </span>
                                        <span className="text-xl tabular-nums">{timeLeft}s</span>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-center text-center space-y-8">
                                    <h3 className="text-3xl font-black text-slate-800 leading-tight">
                                        {questions[currentQuestionIdx]}
                                    </h3>

                                    {phase === 'READING' && (
                                        <div className="text-slate-400 font-bold animate-pulse">
                                            اقرأ السؤال جيداً...
                                        </div>
                                    )}
                                    {phase === 'PREPARING' && (
                                        <div className="text-amber-500 font-bold animate-pulse">
                                            استعد للإجابة...
                                        </div>
                                    )}
                                    {phase === 'ANSWERING' && (
                                        <div className="text-red-500 font-bold animate-pulse flex flex-col items-center gap-2">
                                            <Mic className="w-8 h-8" />
                                            تحدث الآن...
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-8">
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${phase === 'READING' ? 'bg-slate-300' :
                                                phase === 'PREPARING' ? 'bg-amber-400' :
                                                    'bg-indigo-500'
                                                }`}
                                            initial={{ width: "100%" }}
                                            animate={{ width: "0%" }}
                                            transition={{ duration: phase === 'READING' ? 30 : phase === 'PREPARING' ? 15 : 120, ease: "linear" }}
                                            key={`${currentQuestionIdx}-${phase}`} // Reset on phase change
                                        />
                                    </div>
                                </div>

                                {phase === 'ANSWERING' && (
                                    <button
                                        onClick={handleNext}
                                        className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                                    >
                                        انتهيت من الإجابة (إرسال)
                                    </button>
                                )}
                                {phase !== 'ANSWERING' && (
                                    <button
                                        onClick={handleTimerExpiry}
                                        className="mt-6 w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                                    >
                                        تخطي الوقت
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* FINISHING STEP */}
                    {step === 'finishing' && (
                        <motion.div
                            key="finishing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center bg-white p-12 rounded-[2rem] shadow-xl max-w-lg mx-auto"
                        >
                            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-slate-900 mb-2">جاري حفظ إجاباتك...</h2>
                            <p className="text-slate-500 font-bold">شكراً لوقتك ومجهودك</p>
                        </motion.div>
                    )}

                    {/* FEEDBACK STEP */}
                    {step === 'feedback' && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center bg-white p-12 rounded-[2rem] shadow-xl max-w-lg mx-auto space-y-8"
                        >
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                                <Star className="w-10 h-10 text-indigo-500" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2">كيف كانت تجربتك؟</h2>
                                <p className="text-slate-500 font-medium">ساعدنا في تحسين منصة المقابلات</p>
                            </div>

                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="group p-2 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-colors ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200 group-hover:text-amber-200'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="ملاحظات إضافية (اختياري)..."
                                className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                value={feedbackText}
                                onChange={e => setFeedbackText(e.target.value)}
                            />

                            <button
                                onClick={submitFeedback}
                                className="btn-premium w-full py-4 text-lg"
                            >
                                إرسال التقييم وإنهاء
                            </button>
                        </motion.div>
                    )}

                    {/* DONE STEP */}
                    {step === 'done' && (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center bg-white p-12 rounded-[2rem] shadow-xl max-w-lg mx-auto space-y-8"
                        >
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">تم الانتهاء بنجاح!</h2>
                            <p className="text-xl text-slate-600 font-medium">سيتم التواصل معك قريباً بخصوص نتيجة المقابلة.</p>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                            >
                                العودة للرئيسية
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
};

export default InterviewPage;
