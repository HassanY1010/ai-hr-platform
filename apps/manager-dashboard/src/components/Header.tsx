export const Header = () => (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manager Dashboard</h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, Manager</span>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        </div>
    </header>
);
