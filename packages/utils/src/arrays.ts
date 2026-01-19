export const unique = <T>(arr: T[]): T[] => {
    return Array.from(new Set(arr));
};

export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((acc, item) => {
        const group = String(item[key]);
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
    }, {} as Record<string, T[]>);
};

export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};
