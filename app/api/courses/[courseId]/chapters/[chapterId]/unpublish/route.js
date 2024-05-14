import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const courseOwner = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const unpublishedChapter = await prismadb.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChapterInCourse = await prismadb.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            },
        });

        if (!publishedChapterInCourse.length) {
            await prismadb.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        console.log('CHAPTER_UNPUBLISH', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
