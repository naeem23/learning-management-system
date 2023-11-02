import { Navbar } from '@/components/sidebar/navbar';
import { Sidebar } from '@/components/sidebar/sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="h-full">
            <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden md:flex flex-col h-full w-56 fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[70px] h-full">{children}</main>
        </div>
    );
};

export default DashboardLayout;
