export const buildQueryString = (params: Record<string, any>): string => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value));
        }
    });
    const res = query.toString();
    return res ? `?${res}` : '';
};

export const isNetworkError = (error: any): boolean => {
    return !window.navigator.onLine || error.message === 'Network Error';
};
