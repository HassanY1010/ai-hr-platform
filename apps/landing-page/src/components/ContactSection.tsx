import React from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
    return (
        <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                    {/* Contact Info */}
                    <div className="bg-indigo-600 p-12 lg:w-1/3 flex flex-col justify-between text-white">
                        <div>
                            <h2 className="text-3xl font-black mb-6">تواصل معنا</h2>
                            <p className="text-indigo-100 mb-12 font-semibold">نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في بدء رحلتكم الرقمية.</p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="font-bold">support@HrMinds.com</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div className="font-bold">+966 54 520 6666</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-12 lg:w-2/3">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-700">الاسم الكامل</label>
                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="ادخل اسمك" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-700">البريد الإلكتروني</label>
                                    <input type="email" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="example@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-slate-700">الموضوع</label>
                                <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="كيف يمكننا مساعدتك؟" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-slate-700">الرسالة</label>
                                <textarea rows={4} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none" placeholder="اكتب رسالتك هنا..."></textarea>
                            </div>
                            <button className="btn-premium w-full py-5 text-lg">إرسال الرسالة</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
