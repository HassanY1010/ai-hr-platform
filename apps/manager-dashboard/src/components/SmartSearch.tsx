import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, User, CheckSquare, GraduationCap, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService, SearchResult } from '@hr/services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SmartSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReindexing, setIsReindexing] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const data = await searchService.smartSearch(query);
            setResults(data);
        } catch (error) {
            console.error('Search failed', error);
            toast.error('فشل البحث');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReindex = async () => {
        setIsReindexing(true);
        try {
            await searchService.reindex();
            toast.success('تمت إعادة فهرسة البيانات بنجاح');
        } catch (error) {
            console.error('Reindex failed', error);
            toast.error('فشلت إعادة الفهرسة');
        } finally {
            setIsReindexing(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'CANDIDATE': return <User className="w-5 h-5 text-blue-500" />;
            case 'TASK': return <CheckSquare className="w-5 h-5 text-amber-500" />;
            case 'COURSE': return <GraduationCap className="w-5 h-5 text-indigo-500" />;
            default: return <FileText className="w-5 h-5 text-slate-500" />;
        }
    };

    const handleResultClick = (result: SearchResult) => {
        setIsOpen(false);
        switch (result.documentType) {
            case 'CANDIDATE': navigate(`/recruitment/candidates`); break;
            case 'TASK': navigate(`/projects`); break;
            case 'COURSE': navigate(`/training`); break;
        }
    };

    return (
        <div ref={searchRef} className="relative z-[100] flex-1 max-w-md hidden md:block">
            {/* Search Trigger Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    readOnly
                    onClick={() => setIsOpen(true)}
                    placeholder="البحث الذكي (AI)..."
                    className="w-full bg-slate-100 dark:bg-gray-800 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all"
                />
            </div>

            {/* Expanded Search Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed inset-x-0 top-0 h-screen bg-slate-900/40 backdrop-blur-sm z-[200] flex items-start justify-center pt-20 px-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            {/* Search Header */}
                            <div className="p-6 border-b border-slate-50 dark:border-gray-800 flex items-center gap-4">
                                <Search className="w-6 h-6 text-primary-500" />
                                <form onSubmit={handleSearch} className="flex-1">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="ما الذي تبحث عنه اليوم؟ (مثال: موظف خبير في البرمجة)"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white font-bold text-xl"
                                    />
                                </form>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleReindex}
                                        disabled={isReindexing}
                                        title="تحديث الفهرس"
                                        className="p-2 text-slate-400 hover:text-primary-500 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-5 h-5 ${isReindexing ? 'animate-spin' : ''}`} />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-300 hover:text-slate-500">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Content */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                {results.length > 0 ? (
                                    <div className="space-y-2 text-right" dir="rtl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 px-4">أفضل النتائج</p>
                                        {results.map((res) => (
                                            <button
                                                key={res.id}
                                                onClick={() => handleResultClick(res)}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-2xl transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    {getIcon(res.documentType)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{res.metadata.name || res.metadata.title || res.documentType}</h4>
                                                        <span className="text-[10px] font-black text-primary-500">{(res.similarity * 100).toFixed(0)}% صلة</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{res.content}</p>
                                                </div>
                                                <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                ) : query && !isLoading ? (
                                    <div className="py-20 text-center">
                                        <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <h3 className="text-slate-900 dark:text-white font-bold">لم نجد ما تبحث عنه</h3>
                                        <p className="text-slate-500 text-sm mt-1">جرب كلمات مختلفة أو اطلب من الذكاء الاصطناعي البحث بشكل أشمل</p>
                                    </div>
                                ) : (
                                    <div className="py-12 text-right px-6" dir="rtl">
                                        <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">اختصارات البحث</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['مهندسين خبرة', 'مهام متأخرة', 'دورات تدريبية نشطة', 'سير ذاتية جديدة'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="p-3 bg-slate-50 dark:bg-gray-800 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all text-right"
                                                >
                                                    # {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
