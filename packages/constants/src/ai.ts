// packages/constants/src/ai.ts
export const AI_MODELS = {
  HR_DECISION_V1: {
    id: 'hr-decision-v1',
    name: 'HR Decision Model v1',
    description: 'نموذج متخصص في اتخاذ قرارات الموارد البشرية',
    capabilities: ['risk-detection', 'recruitment-scoring', 'performance-analysis'],
    costPerToken: 0.002,
    maxTokens: 4000,
    accuracy: 0.87
  },
  SENTIMENT_V2: {
    id: 'sentiment-v2',
    name: 'Sentiment Analysis v2',
    description: 'تحليل المشاعر والتفاعل من الإجابات اليومية',
    capabilities: ['sentiment-analysis', 'engagement-scoring'],
    costPerToken: 0.001,
    maxTokens: 1000,
    accuracy: 0.92
  },
  CV_PARSER_V1: {
    id: 'cv-parser-v1',
    name: 'CV Parser Model v1',
    description: 'تحليل السير الذاتية واستخراج المهارات',
    capabilities: ['cv-parsing', 'skill-extraction', 'experience-matching'],
    costPerToken: 0.003,
    maxTokens: 8000,
    accuracy: 0.89
  }
} as const

export const AI_RECOMMENDATIONS = {
  RECRUITMENT: {
    HIRE: {
      score: [85, 100],
      label: 'تعيين فوري',
      description: 'مرشح ممتاز مع تطابق عالي للمتطلبات',
      actions: ['جدولة مقابلة', 'إعداد عرض عمل']
    },
    INTERVIEW: {
      score: [60, 84],
      label: 'إجراء مقابلة',
      description: 'مرشح جيد يحتاج لمقابلة تقييمية',
      actions: ['جدولة مقابلة', 'تحضير أسئلة تقنية']
    },
    REVIEW: {
      score: [40, 59],
      label: 'مراجعة إضافية',
      description: 'يحتاج لمزيد من التقييم',
      actions: ['طلب معلومات إضافية', 'مراجعة بديلة']
    },
    REJECT: {
      score: [0, 39],
      label: 'رفض',
      description: 'لا يتطابق مع متطلبات الوظيفة',
      actions: ['إرسال رفض لطيف', 'إضافة للقائمة السوداء']
    }
  },
  
  EMPLOYEE: {
    EXCELLENT: {
      score: [90, 100],
      label: 'أداء ممتاز',
      description: 'موظف متميز يحتاج لتقدير',
      actions: ['تقديم مكافأة', 'منح ترقية', 'توكيل مهام قيادية']
    },
    GOOD: {
      score: [70, 89],
      label: 'أداء جيد',
      description: 'موظف يؤدي مهامه بكفاءة',
      actions: ['تقديم تدريب متقدم', 'منح مسؤوليات إضافية']
    },
    NEEDS_IMPROVEMENT: {
      score: [50, 69],
      label: 'يحتاج تحسين',
      description: 'يحتاج لدعم وتوجيه',
      actions: ['تحديد نقاط الضعف', 'توفير تدريب', 'متابعة أسبوعية']
    },
    AT_RISK: {
      score: [0, 49],
      label: 'عالي الخطورة',
      description: 'يحتاج تدخل فوري',
      actions: ['مقابلة شخصية', 'خطة تحسين فورية', 'مراقبة أداء']
    }
  }
} as const

export const DAILY_QUESTIONS = [
  "هل تشعر بالدعم من فريقك اليوم؟",
  "هل أنت راضٍ عن تقدمك في العمل؟",
  "هل لديك الموارد التي تحتاجها لإنجاز مهامك؟",
  "هل تشعر بالإرهاق اليوم؟",
  "هل تتلقى التغذية الراجعة التي تحتاجها؟",
  "هل تشعر بأن عملك مُقدَّر؟",
  "هل أنت متحمس لمشاريعك الحالية؟",
  "هل تواجه أي عوائق في العمل؟",
  "هل تشعر بالتوازن بين العمل والحياة؟",
  "هل تتطور مهنياً في دورك الحالي؟",
  "هل التواصل داخل فريقك فعال؟",
  "هل تشعر بالأمان الوظيفي؟",
  "هل تستمتع بعملك اليوم؟",
  "هل تحتاج لدعم إضافي؟",
  "هل تشعر بأن صوتك مسموع؟",
  "هل أنت فخور بالعمل الذي تقوم به؟",
  "هل تشعر بالانتماء للمؤسسة؟",
  "هل أنت راضٍ عن بيئة العمل؟",
  "هل تشعر بالتحدي في عملك؟",
  "هل لديك رؤية واضحة لأهدافك؟",
  "هل العلاقات مع زملائك إيجابية؟",
  "هل تشعر بالاستقلالية في عملك؟",
  "هل تتعلم شيئاً جديداً؟",
  "هل تشعر بالإبداع في عملك؟",
  "هل أنت متحمس ليوم غد؟",
  "هل تشعر بالطاقة لإنجاز مهامك؟",
  "هل تلقيت التقدير الذي تستحقه؟",
  "هل تشعر بالعدالة في المعاملة؟",
  "هل أنت سعيد بقراراتك المهنية؟",
  "هل تشعر بأنك تساهم بشكل مؤثر؟"
] as const