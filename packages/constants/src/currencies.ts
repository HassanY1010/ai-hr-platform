export interface Currency {
    name: string;
    code: string;
    symbol: string;
}

export const CURRENCIES: Currency[] = [
    { name: 'Saudi Riyal', code: 'SAR', symbol: '﷼' },
    { name: 'US Dollar', code: 'USD', symbol: '$' },
    { name: 'Euro', code: 'EUR', symbol: '€' },
];
