import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react';

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    quizData: string; // JSON string
    onPass: (score: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, quizData, onPass }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    if (!isOpen) return null;

    let questions: QuizQuestion[] = [];
    try {
        questions = JSON.parse(quizData);
    } catch (e) {
        console.error("Failed to parse quiz", e);
        return null; // Or show error state
    }

    if (!questions || questions.length === 0) return null;

    const handleAnswer = (option: string) => {
        setSelectedOption(option);

        // Wait a bit to show selection then move next
        setTimeout(() => {
            if (option === questions[currentQuestion].answer) {
                setScore(s => s + 1);
            }

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(c => c + 1);
                setSelectedOption(null);
            } else {
                setShowResults(true);
            }
        }, 500);
    };

    const passed = score >= Math.ceil(questions.length * 0.7); // 70% pass rate? Or just completion? Let's say needs 2/3 correct.

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                    {!showResults ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-indigo-600" />
                                    اختبار التحقق من الفهم
                                </h3>
                                <div className="text-sm font-bold text-slate-400">
                                    {currentQuestion + 1} / {questions.length}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">
                                    {questions[currentQuestion].question}
                                </h4>

                                <div className="space-y-3">
                                    {questions[currentQuestion].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => !selectedOption && handleAnswer(option)}
                                            disabled={!!selectedOption}
                                            className={`w-full p-4 rounded-xl text-right font-medium transition-all duration-200 border-2 
                                                ${selectedOption === option
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            {passed ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">ممتاز!</h3>
                                    <p className="text-slate-500 mb-8">لقد اجتزت الاختبار بنجاح ({score}/{questions.length})</p>
                                    <button
                                        onClick={() => onPass(score)}
                                        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                                    >
                                        إكمال التدريب واستلام الشهادة
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                                        <AlertCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">حاول مرة أخرى</h3>
                                    <p className="text-slate-500 mb-8">يجب عليك الإجابة بشكل صحيح لإكمال التدريب.</p>
                                    <button
                                        onClick={() => {
                                            setShowResults(false);
                                            setCurrentQuestion(0);
                                            setScore(0);
                                            setSelectedOption(null);
                                        }}
                                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                                    >
                                        إعادة الاختبار
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
