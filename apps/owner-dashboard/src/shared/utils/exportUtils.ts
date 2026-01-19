
import { toast } from 'sonner';

/**
 * Fetches the Amiri font from Google Fonts CDN and adds it to the jsPDF instance.
 * @param doc The jsPDF document instance
 */
const addArabicFont = async (doc: any) => {
    try {
        const fontUrl = 'https://fonts.gstatic.com/s/amiri/v26/J7aRnpd8CGxBHpUrtLMA7w.ttf';
        const response = await fetch(fontUrl);
        if (!response.ok) throw new Error('Failed to fetch font');
        const buffer = await response.arrayBuffer();

        const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        };

        const base64Font = arrayBufferToBase64(buffer);
        doc.addFileToVFS('Amiri-Regular.ttf', base64Font);
        doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
        doc.setFont('Amiri');
        return true;
    } catch (error) {
        console.error('Failed to load Arabic font:', error);
        toast.error('فشل تحميل الخط العربي، قد تظهر الحروف بشكل غير صحيح.');
        return false;
    }
};

export const exportUtils = {
    exportCSV: (data: any[], fileName: string) => {
        if (!data || data.length === 0) {
            toast.error('لا توجد بيانات للتصدير');
            return;
        }

        // Get headers from the first object
        const headers = Object.keys(data[0]);

        // Convert data to CSV string
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(fieldName => {
                    const val = row[fieldName];
                    // Escape quotes and wrap in quotes if necessary
                    const stringVal = String(val).replace(/"/g, '""');
                    return `"${stringVal}"`;
                }).join(',')
            )
        ].join('\n');

        // Add BOM for Excel UTF-8 compatibility
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('تم تصدير ملف CSV بنجاح');
    },

    exportExcel: async (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
        if (!data || data.length === 0) {
            toast.error('لا توجد بيانات للتصدير');
            return;
        }

        try {
            const XLSX = await import('xlsx');
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            XLSX.writeFile(wb, `${fileName}.xlsx`);
            toast.success('تم تصدير ملف Excel بنجاح');
        } catch (error) {
            console.error('Excel export failed:', error);
            toast.error('فشل تصدير ملف Excel');
        }
    },

    exportPDF: async (data: any[], columns: string[], fileName: string, title: string) => {
        if (!data || data.length === 0) {
            toast.error('لا توجد بيانات للتصدير');
            return;
        }

        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();

            // Load Arabic Font
            await addArabicFont(doc);

            // Document properties
            doc.setProperties({
                title: title,
                author: 'System Manager'
            });

            // Add Title
            doc.setFontSize(18);
            doc.text(title, doc.internal.pageSize.width - 14, 20, { align: 'right', isInputVisual: true } as any); // Right align for Arabic

            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 14, 20);

            // Prepare Table Data
            // Map headers to be Arabic friendly if they are keys? 
            // The caller should pass translated headers (columns) and data values that match order or are arrays.
            // But usually we pass objects.

            // Assuming data is array of objects and columns are the HEADERS to display.
            // We need to map data keys to these columns.
            // Actually, let's keep it simple: data should be prepared by caller as Array of Arrays or Objects matching columns?
            // autoTable handles Array of Objects if columns are specified by key.
            // BUT for Arabic, mixing RTL and LTR in autoTable is tricky.
            // Let's assume the caller passes formatted data (Array of Arrays) for maximum control or we handle it here.

            // Let's assume data is Array of Objects
            // Let's assume data is Array of Objects
            const tableBody = data.map(row => Object.values(row).map(val => String(val)));

            // Columns need to be the headers
            // We need to reshape Arabic? jspdf with custom font handles rendering, 
            // BUT sometimes characters are disconnected (unshaped).
            // However, Amiri font usually works with 'isInputVisual: false' if text is standard, OR we need a shaper.
            // Without a shaper library (like 'mapbox/mapbox-gl-rtl-text' or similar logic), words might be disconnected.
            // But let's try the font first. It's better than symbols.

            autoTable(doc, {
                head: [columns],
                body: tableBody,
                startY: 25,
                styles: {
                    font: 'Amiri', // Use the added font
                    halign: 'right', // General alignment for Arabic
                    fontStyle: 'normal'
                },
                headStyles: {
                    halign: 'right',
                    fillColor: [66, 66, 66],
                    textColor: 255
                }
            });

            doc.save(`${fileName}.pdf`);
            toast.success('تم تصدير ملف PDF بنجاح');
        } catch (error) {
            console.error('PDF export failed:', error);
            toast.error('فشل تصدير ملف PDF');
        }
    }
};
