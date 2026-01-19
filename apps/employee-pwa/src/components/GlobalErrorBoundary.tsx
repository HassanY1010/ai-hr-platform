import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">عذراً، حدث خطأ غير متوقع</h1>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            نواجه مشكلة في تحميل التطبيق. تم تسجيل الخطأ وسنعمل على حله.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            إعادة تحميل الصفحة
                        </button>

                        {import.meta.env.DEV && (
                            <div className="mt-8 text-left dir-ltr p-4 bg-red-50 rounded-xl text-xs text-red-800 font-mono overflow-auto max-h-40">
                                {this.state.error?.toString()}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
