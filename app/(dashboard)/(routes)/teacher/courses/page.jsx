import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import { DataTable } from '@/components/courses/data-table';
import { columns } from '@/components/courses/columns';
import prismadb from '@/lib/prismadb';

const CoursesPage = async () => {
    const {userId} = auth()

    if (!userId) {
        return redirect("/")
    }

    const courses = await prismadb.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;
