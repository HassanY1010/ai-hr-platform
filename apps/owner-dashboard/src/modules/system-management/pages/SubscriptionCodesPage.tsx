import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@hr/services';
import { LoadingCard, EmptyState, Button } from '@hr/ui';
import { Plus, Copy, CheckCircle2, XCircle, RefreshCw, Pencil, Trash2, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@hr/ui';
import { AnimatePresence } from 'framer-motion';

interface SubscriptionCode {
    id: string;
    code: string;
    status: 'UNUSED' | 'USED';
    company?: {
        name: string;
    };
    createdAt: string;
    usedAt?: string;
}

const SubscriptionCodesPage = () => {
    const queryClient = useQueryClient();
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingItem, setEditingItem] = useState<SubscriptionCode | null>(null);
    const [deletingItem, setDeletingItem] = useState<SubscriptionCode | null>(null);
    const [editForm, setEditForm] = useState({ code: '', status: 'UNUSED' as 'UNUSED' | 'USED' });


    const { data, isLoading } = useQuery({
        queryKey: ['subscription-codes'],
        queryFn: async () => {
            const response = await apiClient.get<any>('/subscription-codes');
            return response.data as SubscriptionCode[];
        }
    });

    const generateMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post('/subscription-codes/generate', {});
        },
        onMutate: () => setIsGenerating(true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-codes'] });
            toast.success('تم إنشاء رمز جديد بنجاح');
            setIsGenerating(false);
        },
        onError: () => {
            toast.error('حدث خطأ أثناء إنشاء الرمز');
            setIsGenerating(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            await apiClient.patch(`/subscription-codes/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-codes'] });
            toast.success('تم تحديث الرمز بنجاح');
            setEditingItem(null);
        },
        onError: () => toast.error('حدث خطأ أثناء تحديث الرمز')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/subscription-codes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-codes'] });
            toast.success('تم حذف الرمز بنجاح');
            setDeletingItem(null);
        },
        onError: () => toast.error('حدث خطأ أثناء حذف الرمز')
    });

    const handleEdit = (item: SubscriptionCode) => {
        setEditingItem(item);
        setEditForm({ code: item.code, status: item.status });
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('تم نسخ الرمز');
    };

    if (isLoading) return <LoadingCard title="جاري تحميل الرموز..." />;


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">رموز الاشتراك</h1>
                    <p className="text-neutral-500 mt-1">إدارة رموز الدخول للشركات الجديدة</p>
                </div>
                <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>إنشاء رمز جديد</span>
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">الرمز</th>
                                <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">الحالة</th>
                                <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">الشركة المستخدمة</th>
                                <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">تاريخ الإنشاء</th>
                                <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">تاريخ الاستخدام</th>
                                <th className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {data && data.length > 0 ? (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-lg text-primary-600 tracking-wider">
                                            {item.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'UNUSED'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                                                }`}>
                                                {item.status === 'UNUSED' ? (
                                                    <><CheckCircle2 className="w-3 h-3" /> متاح</>
                                                ) : (
                                                    <><XCircle className="w-3 h-3" /> مستخدم</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-900 font-medium">
                                            {item.company?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 text-sm">
                                            {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 text-sm">
                                            {item.usedAt ? new Date(item.usedAt).toLocaleDateString('ar-EG') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => copyToClipboard(item.code)}
                                                    className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-primary-600 transition-colors"
                                                    title="نسخ الرمز"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-indigo-600 transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingItem(item)}
                                                    className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-red-600 transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <EmptyState
                                            title="لا توجد رموز"
                                            description="قم بإنشاء رمز جديد للبدء"
                                            icon={RefreshCw}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {editingItem && (
                    <Modal
                        isOpen={!!editingItem}
                        onClose={() => setEditingItem(null)}
                        title="تعديل رمز الاشتراك"
                    >
                        <div className="space-y-4 p-1">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">الرمز</label>
                                <input
                                    type="text"
                                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={editForm.code}
                                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">الحالة</label>
                                <select
                                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                >
                                    <option value="UNUSED">متاح (UNUSED)</option>
                                    <option value="USED">مستخدم (USED)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => updateMutation.mutate({ id: editingItem.id, data: editForm })}
                                    className="flex-1 bg-primary-600 text-white"
                                    disabled={updateMutation.isPending}
                                >
                                    <Save className="w-4 h-4 ml-2" />
                                    حفظ التغييرات
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1"
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {deletingItem && (
                    <Modal
                        isOpen={!!deletingItem}
                        onClose={() => setDeletingItem(null)}
                        title="تأكيد الحذف"
                    >
                        <div className="space-y-4 p-1">
                            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-lg">
                                <AlertTriangle className="w-5 h-5" />
                                <p className="text-sm font-medium">هل أنت متأكد من رغبتك في حذف هذا الرمز؟ لا يمكن التراجع عن هذا الإجراء.</p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                <p className="text-sm text-neutral-500 mb-1">الرمز المراد حذفه:</p>
                                <p className="font-mono font-bold text-lg">{deletingItem.code}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => deleteMutation.mutate(deletingItem.id)}
                                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? 'جاري الحذف...' : 'تأكيد الحذف'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setDeletingItem(null)}
                                    className="flex-1"
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionCodesPage;
