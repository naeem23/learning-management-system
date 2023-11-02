import Image from 'next/image';

import { SidebarRoutes } from './sidebar-routes';

export const Sidebar = () => {
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
            {/* logo */}
            <div className="p-6">
                <Image width={130} height={130} alt="logo" src="/logo.svg" />
            </div>

            {/* sidebar routes */}
            <SidebarRoutes />
        </div>
    );
};
