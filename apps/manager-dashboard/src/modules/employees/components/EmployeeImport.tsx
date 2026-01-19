import React, { useRef, useState } from 'react';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { employeeService } from '@hr/services';

interface EmployeeImportProps {
    onCheck?: () => void;
    onClose: () => void;
    onSuccess: () => void;
}

export const EmployeeImport: React.FC<EmployeeImportProps> = ({ onClose, onSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseCSV = (text: string) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = [];

        // Mapping for different header names (Arabic and English)
        const nameKeys = ['name', 'الاسم', 'اسم الموظف'];
        const emailKeys = ['email', 'البريد', 'البريد الإلكتروني'];
        const deptKeys = ['department', 'القسم', 'إدارة'];
        const posKeys = ['position', 'المسمى الوظيفي', 'الوظيفة'];

        const findValue = (row: any, keys: string[]) => {
            const key = keys.find(k => headers.includes(k.toLowerCase()));
            return key ? row[headers.indexOf(key.toLowerCase())] : null;
        };

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const scan = line.split(',').map(s => s.trim());

            const name = findValue(scan, nameKeys);
            const email = findValue(scan, emailKeys);
            const department = findValue(scan, deptKeys) || 'General';
            const position = findValue(scan, posKeys) || 'Employee';

            if (email && name) {
                data.push({
                    name,
                    email,
                    department,
                    position,
                    startDate: new Date().toISOString()
                });
            }
        }
        return data;
    };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            toast.error('يرجى تحميل ملف CSV صالح');
            return;
        }

        setFile(selectedFile);
        setIsLoading(true);
        setError(null);

        try {
            const text = await selectedFile.text();
            const mappedData = parseCSV(text);

            if (mappedData.length === 0) {
                setError('لم يتم العثور على بيانات صالحة. تأكد من وجود أعمدة name, email في ملف CSV.');
            } else {
                setPreviewData(mappedData);
            }
        } catch (err) {
            console.error('Error parsing csv:', err);
            setError('حدث خطأ أثناء قراءة الملف');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;

        setIsUploading(true);
        try {
            const result = await employeeService.bulkCreateEmployees(previewData);

            if (result.errorCount > 0) {
                toast.warning(`تم استيراد ${result.createdCount} موظف بنجاح، وفشل ${result.errorCount}`);
            } else {
                toast.success(`تم استيراد ${result.createdCount} موظف بنجاح`);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Import failed', err);
            toast.error('فشل عملية الاستيراد. يرجى التحقق من صيانة الخادم أو شكل الملف.');
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold dark:text-white">استيراد الموظفين (CSV)</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {!file ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 dark:text-white">اضغط للتحميل أو اسحب الملف هنا</h4>
                            <p className="text-gray-500 text-sm">ملفات CSV فقط (Headers: name, email, department, position)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                <div className="p-3 bg-white dark:bg-blue-800 rounded-lg shadow-sm">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium dark:text-white">{file.name}</p>
                                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button onClick={() => { setFile(null); setPreviewData([]); }} className="text-red-500 hover:text-red-600 font-medium text-sm">
                                    إزالة
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                    <span className="mr-3 text-gray-500">جاري قراءة الملف...</span>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold dark:text-white">معاينة البيانات ({previewData.length} موظف)</h4>
                                    </div>
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                                        <table className="w-full text-sm text-right">
                                            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                                <tr>
                                                    <th className="p-3 font-medium text-gray-600 dark:text-gray-300">الاسم</th>
                                                    <th className="p-3 font-medium text-gray-600 dark:text-gray-300">البريد الإلكتروني</th>
                                                    <th className="p-3 font-medium text-gray-600 dark:text-gray-300">القسم</th>
                                                    <th className="p-3 font-medium text-gray-600 dark:text-gray-300">المسمى الوظيفي</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {previewData.slice(0, 50).map((row, i) => (
                                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td className="p-3 dark:text-gray-300">{row.name}</td>
                                                        <td className="p-3 dark:text-gray-300">{row.email}</td>
                                                        <td className="p-3 dark:text-gray-300">{row.department}</td>
                                                        <td className="p-3 dark:text-gray-300">{row.position}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {previewData.length > 50 && (
                                            <div className="p-2 text-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800">
                                                يتم عرض أول 50 سجل فقط
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!file || previewData.length === 0 || isUploading}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>جاري المعالجة...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>تأكيد الاستيراد</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
