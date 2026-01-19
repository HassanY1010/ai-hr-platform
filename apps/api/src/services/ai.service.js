import prisma from '../config/db.js';

export const aiService = {
    analyzeCandidate: async (candidateData) => {
        // Mock analysis
        return {
            score: Math.floor(Math.random() * 30) + 70, // 70-100
            summary: "Based on the resume and profile, this candidate shows strong potential in relevant skills.",
            status: "RECOMMENDED"
        };
    },

    analyzeJobDescription: async (description) => {
        // Mock description enhancement
        return description + "\n\n(AI Enhanced: Added emphasis on teamwork and agile methodologies)";
    },

    analyzeTrainingNeeds: async (employeeData) => {
        // Mock training needs analysis
        return {
            needs: [
                { topic: "Advanced Leadership", reason: "Potential for management role." },
                { topic: "Cloud Architecture", reason: "Project requirements alignment." }
            ],
            score: Math.floor(Math.random() * 20) + 80
        };
    },

    calculateProjectRisk: async (projectData) => {
        // Mock risk analysis
        return {
            riskLevel: "LOW",
            score: 15, // 0-100 risk score
            analysis: "Project is on track with sufficient resources."
        };
    },

    generateCheckInQuestions: async (employeeContext) => {
        // Use Raw SQL for maximum performance (ORDER BY RAND())
        // SELECT * FROM CheckInQuestion WHERE type = 'FACT' AND isActive = 1 ORDER BY RAND() LIMIT 1

        const [fact] = await prisma.$queryRaw`SELECT * FROM CheckInQuestion WHERE type = 'FACT' AND isActive = 1 ORDER BY RAND() LIMIT 1`;
        const [feeling] = await prisma.$queryRaw`SELECT * FROM CheckInQuestion WHERE type = 'FEELING' AND isActive = 1 ORDER BY RAND() LIMIT 1`;
        const [barrier] = await prisma.$queryRaw`SELECT * FROM CheckInQuestion WHERE type = 'BARRIER' AND isActive = 1 ORDER BY RAND() LIMIT 1`;

        return [
            {
                order: 1,
                type: 'FACT',
                text: fact?.text || 'هل أنهيت مهامك اليوم؟'
            },
            {
                order: 2,
                type: 'FEELING',
                text: feeling?.text || 'كيف تشعر اليوم؟'
            },
            {
                order: 3,
                type: 'BARRIER',
                text: barrier?.text || 'ما هي التحديات؟'
            }
        ];
    },

    analyze30x3Data: async (assessments) => {
        // analyze 30x3 assessments to generate aggregated insights and alerts
        // This expects an array of CheckInAssessment objects with their entries

        if (!assessments || assessments.length === 0) {
            return {
                insights: [],
                alerts: [
                    {
                        id: 'no-data',
                        title: 'البيانات غير متوفرة لتحليل التغذية الراجعة',
                        description: 'لم يتم تقديم الإجابات القابلة للتحليل (null). لا يمكن استخلاص اتجاهات المشاعر أو المواضيع من البيانات غير المتاحة. يرجى توفير الإجابات لتحليل أدق.',
                        severity: 'warning'
                    }
                ]
            };
        }

        const insights = [];
        const alerts = [];

        // 1. Calculate Aggregates
        let totalScore = 0;
        let highRiskCount = 0;
        let stressCount = 0;

        assessments.forEach(a => {
            totalScore += a.score || 0;
            if (a.riskLevel === 'RISK_OF_BURNOUT') highRiskCount++;
            if (a.riskLevel === 'TIRED' || a.riskLevel === 'RISK_OF_BURNOUT') stressCount++;
        });

        const avgScore = totalScore / assessments.length;

        // 2. Generate Detailed Report Logic (Simulation of Generative AI)

        // Insight 1: General Sentiment (Detailed)
        if (avgScore > 80) {
            insights.push({
                id: 'exceptional-morale',
                type: 'engagement',
                title: 'تميز استثنائي في الروح المعنوية',
                description: 'يُظهر تحليل الأنماط السلوكية حماسًا عاليًا وتفاعلًا إيجابيًا جدًا من الفريق. تشير البيانات إلى توافق قوي بين الأهداف الشخصية وأهداف الشركة، مع انخفاض ملحوظ في مؤشرات القلق.',
                confidence: 96
            });
        } else if (avgScore > 65) {
            insights.push({
                id: 'stable-morale',
                type: 'engagement',
                title: 'استقرار نسبي في بيئة العمل',
                description: 'المؤشرات العامة إيجابية وتميل نحو الاستقرار. هناك توازن جيد بين ضغط العمل والإنجاز، ولكن يُنصح بمراقبة بعض التذبذبات الطفيفة التي قد تظهر في فترات التسليم النهائية.',
                confidence: 89
            });
        } else {
            insights.push({
                id: 'concerning-morale',
                type: 'engagement',
                title: 'تراجع ملحوظ في مؤشرات الرضا',
                description: 'رصدت خوارزميات التحليل نمطًا سلبيًا متكررًا. يبدو أن هناك ضغطًا تراكميًا يؤثر على الإنتاجية وجودة العمل. يتطلب هذا الوضع تدخلاً استباقيًا لفهم الأسباب الجذرية قبل تفاقمها.',
                confidence: 92
            });
        }

        // Insight 2: Stress & Burnout Analysis (Detailed)
        if (stressCount > assessments.length * 0.3) {
            insights.push({
                id: 'stress-pattern',
                type: 'talent',
                title: 'نمط إجهاد متصاعد',
                description: `تم اكتشاف أن ${Math.round((stressCount / assessments.length) * 100)}% من التقييمات تشير إلى مستويات إجهاد فوق المتوسط. يبدو أن عبء العمل الحالي قد يتجاوز السعة التشغيلية للفريق، مما يهدد بزيادة معدل الدوران الوظيفي إذا لم يتم توزيع المهام بشكل أكثر توازناً.`,
                confidence: 94
            });
        } else {
            insights.push({
                id: 'resilience-pattern',
                type: 'talent',
                title: 'مروانة نفسية عالية',
                description: 'رغم تحديات العمل اليومية، يُظهر الفريق قدرة عالية على التكيف والمرونة. تشير البيانات إلى نجاح استراتيجيات الدعم الحالية ووجود بيئة عمل داعمة وصحية.',
                confidence: 88
            });
        }

        // Insight 3: Operational Efficiency (Inferred)
        if (avgScore > 70) {
            insights.push({
                id: 'flow-state',
                type: 'engagement',
                title: 'مؤشرات تدفق (Flow) إيجابية',
                description: 'تحليل العوائق (Barriers) يشير إلى انخفاض المعوقات التقنية والإدارية، مما يسمح للموظفين بالتركيز العميق والإنجاز السريع. استمر في سياسة "إزالة العقبات" الحالية.',
                confidence: 85
            });
        } else {
            insights.push({
                id: 'friction-detected',
                type: 'talent',
                title: 'احتكاك تشغيلي معيق',
                description: 'تكرر ذكر معوقات في إجابات الأسئلة المفتوحة، مما يشير إلى وجود اختناقات (Bottlenecks) في العمليات أو نقص في الأدوات اللازمة. مراجعة العمليات التشغيلية قد تحرر طاقة إنتاجية كامنة.',
                confidence: 87
            });
        }


        // 3. Generate Alerts based on thresholds
        if (highRiskCount >= 3) {
            alerts.push({
                id: 'critical-stress',
                title: 'تنبيه حرج: خطر الاحتراق الوظيفي وشيك',
                description: 'تجاوزت مؤشرات الخطر النقطة الحرجة. التحليل يتنبأ باحتمالية عالية لتأثر الأداء أو حدوث استقالات مفاجئة. يرجى عقد جلسات فردية فورية مع الفريق المتأثر.',
                severity: 'critical'
            });
        } else if (stressCount > 0) {
            alerts.push({
                id: 'warning-stress',
                title: 'تحذير وقائي: بوادر إرهاق',
                description: 'هناك إشارات خفيفة ولكن مستمرة على التعب. التدخل المبكر الآن من خلال "إجازات قصيرة" أو "تخفيف الأحمال" سيمنع تحول هذه الحالة إلى مشكلة مزمنة.',
                severity: 'warning'
            });
        }

        return {
            insights,
            alerts
        };
    }
};
