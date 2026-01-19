export const aiConfig = {
    defaultModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    endpoints: {
        analyze: '/ai/analyze',
        summarize: '/ai/summarize',
        recommend: '/ai/recommend',
    },
};
