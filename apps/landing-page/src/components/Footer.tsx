import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <span className="text-white font-black text-xl">H</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">
                                HR <span className="text-indigo-600">Minds</span>
                            </span>
                        </div>
                        <p className="text-slate-500 font-semibold leading-relaxed">
                            المنصة الرائدة في تحويل إدارة الموارد البشرية من خلال الحلول الذكية والبيانات الدقيقة.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-lg font-black text-slate-900 mb-6">
                            <a href="/#features" className="hover:text-indigo-600 transition-colors">المنتج</a>
                        </h4>
                        <ul className="space-y-4 font-semibold text-slate-600">
                            <li><a href="/#features" className="hover:text-indigo-600 transition-colors">المزايا الرئيسية</a></li>
                            <li><a href="/#ai" className="hover:text-indigo-600 transition-colors">الذكاء الاصطناعي</a></li>
                            <li><a href="/#recruitment" className="hover:text-indigo-600 transition-colors">التوظيف الآلي</a></li>
                            <li><a href="/#analytics" className="hover:text-indigo-600 transition-colors">تحليلات البيانات</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-lg font-black text-slate-900 mb-6">
                            <a href="/about" className="hover:text-indigo-600 transition-colors">الشركة</a>
                        </h4>
                        <ul className="space-y-4 font-semibold text-slate-600">
                            <li><a href="/about" className="hover:text-indigo-600 transition-colors">عن المنصة</a></li>
                            <li><a href="/success-stories" className="hover:text-indigo-600 transition-colors">قصص النجاح</a></li>
                            <li><a href="/jobs" className="hover:text-indigo-600 transition-colors">وظائف شاغرة</a></li>
                            <li><a href="/#contact" className="hover:text-indigo-600 transition-colors">اتصل بنا</a></li>
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="text-lg font-black text-slate-900 mb-6">
                            <a href="/privacy" className="hover:text-indigo-600 transition-colors">قانوني</a>
                        </h4>
                        <ul className="space-y-4 font-semibold text-slate-600">
                            <li><a href="/privacy" className="hover:text-indigo-600 transition-colors">سياسة الخصوصية</a></li>
                            <li><a href="/terms" className="hover:text-indigo-600 transition-colors">الشروط والأحكام</a></li>
                            <li><a href="/cookies" className="hover:text-indigo-600 transition-colors">سياسة ملفات الارتباط</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 font-bold text-sm text-center">
                        © {new Date().getFullYear()} HR Minds. جميع الحقوق محفوظة لشركة آي جي إس.
                    </p>
                    <div className="flex gap-8 text-sm font-bold text-slate-400">
                        <span>الرياض، المملكة العربية السعودية</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
