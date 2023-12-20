import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export const getCourse = async (id) => {
    const { userId } = auth();

    const course = await prismadb.course.findUnique({
        where: {
            id,
            userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: 'asc',
                },
            },
            attachments: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    return course;
};
