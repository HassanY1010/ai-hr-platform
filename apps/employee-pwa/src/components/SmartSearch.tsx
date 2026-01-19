import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, User, CheckSquare, GraduationCap, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService, SearchResult } from '@hr/services';
import { useNavigate } from 'react-router-dom';

export const SmartSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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
        } finally {
            setIsLoading(false);
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
        // Navigate based on type
        switch (result.documentType) {
            case 'CANDIDATE': navigate(`/recruitment/candidates`); break; // Or specific candidate page if exists
            case 'TASK': navigate(`/tasks`); break;
            case 'COURSE': navigate(`/training`); break;
        }
    };

    return (
        <div ref={searchRef} className="relative z-[100]">
            {/* Search Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-3 w-full"
            >
                <Search className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400 text-sm font-medium">ابحث عن أي شيء... (مثال: سيرة ذاتية لمشاري)</span>
            </button>

            {/* Expanded Search Modal-like Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed inset-x-4 top-20 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden max-h-[70vh] flex flex-col pointer-events-auto"
                    >
                        {/* Search Input Area */}
                        <form onSubmit={handleSearch} className="p-6 border-b border-slate-50 flex items-center gap-4">
                            <Search className="w-6 h-6 text-indigo-500" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="ابحث بصوتك أو بكتابة سؤالك..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold text-lg"
                            />
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                            ) : (
                                <button type="button" onClick={() => setIsOpen(false)}>
                                    <X className="w-6 h-6 text-slate-300 hover:text-slate-500 transition-colors" />
                                </button>
                            )}
                        </form>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">أفضل النتائج</p>
                                    {results.map((res) => (
                                        <button
                                            key={res.id}
                                            onClick={() => handleResultClick(res)}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group text-right"
                                        >
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {getIcon(res.documentType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 truncate">{res.metadata.name || res.metadata.title || res.documentType}</h4>
                                                    <span className="text-[10px] font-black text-indigo-500">{(res.similarity * 100).toFixed(0)}% صلة</span>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-1">{res.content}</p>
                                            </div>
                                            <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            ) : query && !isLoading ? (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-slate-900 font-bold">لا توجد نتائج مطابقة</h3>
                                    <p className="text-slate-500 text-sm mt-1">حاول كتابة السؤال بطريقة أخرى</p>
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-400">
                                    <p className="text-sm">ابدأ بكتبة ما تبحث عنه...</p>
                                </div>
                            )}
                        </div>

                        {/* Footer / Context */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> موظفين
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-amber-500" /> مهام
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" /> تدريب
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
