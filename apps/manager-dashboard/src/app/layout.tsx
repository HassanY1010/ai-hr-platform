import { ReactNode } from 'react';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {children}
        </div>
    );
};
