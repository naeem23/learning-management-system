'use client';

import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export const SidebarItem = ({ icon: Icon, label, href }) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === '/' && href === '/') ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
                isActive &&
                    'text-teal-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-teal-700'
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon size={22} />
                {label}
            </div>
            <div
                className={cn(
                    'ml-auto opacity-0 border-2 border-teal-700 h-full transition-all rounded-r-md',
                    isActive && 'opacity-100'
                )}
            />
        </button>
    );
};