import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const ownCourse = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const chapter = await prismadb.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log('[COURSES_CHAPTER_ID]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
