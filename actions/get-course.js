import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { getProgress } from './get-progress';

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


export const getCourses = async ({userId, title, categoryId}) => {
    try {
        const courses = await prismadb.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        const coursesWithProgress = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage
                }
            })
        );

        return coursesWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return []
    }
}