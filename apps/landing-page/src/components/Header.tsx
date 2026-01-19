import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    onAuthClick?: (mode: 'login' | 'signup') => void;
}

const Header = ({ onAuthClick }: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'المزايا', href: '/#features' },
        { name: 'الذكاء الاصطناعي', href: '/#ai' },
        { name: 'التوظيف الآلي', href: '/#recruitment' },
        { name: 'التحليلات', href: '/#analytics' },
        { name: 'الأسعار', href: '/#pricing' },
        { name: 'الوظائف', href: '/jobs', isRoute: true },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-black text-xl">H</span>
                    </div>
                    <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        HR <span className="text-indigo-600">Minds</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.isRoute ? (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors duration-300 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors duration-300 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        )
                    ))}
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => {
                            const el = document.getElementById('auth-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            else window.location.href = '/#auth-section';
                        }}
                        className="text-slate-700 font-bold hover:text-indigo-600 transition-colors"
                    >
                        تسجيل الدخول
                    </button>
                    <button
                        onClick={() => {
                            if (onAuthClick) onAuthClick('signup');
                            const el = document.getElementById('auth-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            else window.location.href = '/#auth-section';
                        }}
                        className="btn-premium py-2 px-6"
                    >
                        ابدأ الاشتراك الآن
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        }
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-bold text-slate-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <hr className="border-slate-100" />
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        const el = document.getElementById('auth-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        else window.location.href = '/#auth-section';
                                    }}
                                    className="text-center font-bold text-slate-700 py-3"
                                >
                                    تسجيل الدخول
                                </button>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        if (onAuthClick) onAuthClick('signup');
                                        const el = document.getElementById('auth-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        else window.location.href = '/#auth-section';
                                    }}
                                    className="btn-premium py-3"
                                >
                                    ابدأ الاشتراك الآن
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Header;
