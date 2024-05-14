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

        const chapter = await prismadb.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        const muxData = await prismadb.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            },
        });

        if (
            !chapter ||
            !muxData ||
            !chapter.title ||
            !chapter.description ||
            !chapter.videoUrl
        ) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const publishedChapter = await prismadb.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedChapter);
    } catch (error) {
        console.log('[CHAPTER_PUBLISH]', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
