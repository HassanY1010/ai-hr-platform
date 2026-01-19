import React, { useEffect, useState } from 'react';
import { apiClient } from '@hr/services';

interface CheckInAssessment {
    id: string;
    date: string;
    score: number;
    riskLevel: string;
    recommendation: string;
    status: string;
}

export const CheckInStats: React.FC<{ employeeId: string }> = ({ employeeId }) => {
    const [history, setHistory] = useState<CheckInAssessment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await apiClient.get<any>(`/check-in/employee/${employeeId}`);
                // Adjust if response wrapper structure differs
                setHistory(res.data || []);
            } catch (err) {
                console.error('Failed to fetch check-in history', err);
            } finally {
                setLoading(false);
            }
        };

        if (employeeId) fetchHistory();
    }, [employeeId]);

    if (loading) return <div className="p-4 bg-white rounded-lg shadow animate-pulse h-32"></div>;

    if (history.length === 0) return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">تقييم الرفاهية 30x3</h3>
            <p className="text-gray-500">لم يتم تسجيل أي تقييمات بعد.</p>
        </div>
    );

    const latest = history[0];

    const getRiskLabel = (risk: string) => {
        const map: Record<string, string> = {
            'STABLE': 'مستقر',
            'TIRED': 'مجهد',
            'BURNOUT': 'احتراق',
            'RISK': 'خطر',
            'CRITICAL': 'حرج'
        };
        return map[risk] || risk;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">تقييم الرفاهية 30x3</h3>
                <span className="text-xs text-gray-400">آخر تحديث: {new Date(latest.date).toLocaleDateString('ar-EG')}</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-sm text-blue-600 font-medium mb-1">درجة العافية</span>
                    <div className="text-3xl font-bold text-blue-800">{latest.score}%</div>
                </div>

                {/* Risk Level */}
                <div className={`rounded-lg p-4 flex flex-col items-center justify-center
                    ${latest.riskLevel === 'STABLE' ? 'bg-green-50' :
                        latest.riskLevel === 'TIRED' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <span className={`text-sm font-medium mb-1
                         ${latest.riskLevel === 'STABLE' ? 'text-green-600' :
                            latest.riskLevel === 'TIRED' ? 'text-yellow-600' : 'text-red-600'}
                    `}>مستوى الخطورة</span>
                    <div className={`text-xl font-bold
                         ${latest.riskLevel === 'STABLE' ? 'text-green-800' :
                            latest.riskLevel === 'TIRED' ? 'text-yellow-800' : 'text-red-800'}
                    `}>{getRiskLabel(latest.riskLevel)}</div>
                </div>

                {/* Recommendation */}
                <div className="bg-gray-50 rounded-lg p-4 col-span-1 md:col-span-1">
                    <span className="text-sm text-gray-500 font-medium block mb-2">توصية الذكاء الاصطناعي</span>
                    <p className="text-gray-800 text-sm font-medium leading-relaxed">
                        {latest.recommendation || 'لا توجد توصيات حالياً.'}
                    </p>
                </div>
            </div>

            {/* History Table (Mini) */}
            <div className="px-6 pb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">السجل الحديث</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-3 py-2">التاريخ</th>
                                <th className="px-3 py-2">الدرجة</th>
                                <th className="px-3 py-2">الخطر</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.slice(0, 5).map((item) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-3 py-2">{new Date(item.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="px-3 py-2 font-medium">{item.score}%</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded text-xs
                                            ${item.riskLevel === 'STABLE' ? 'bg-green-100 text-green-800' :
                                                item.riskLevel === 'TIRED' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                                         `}>
                                            {getRiskLabel(item.riskLevel)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
