import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        const courseOwner = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const lastChapter = await prismadb.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: 'desc',
            },
        });

        const position = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await prismadb.chapter.create({
            data: {
                title,
                position,
                courseId: params.courseId,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log('[ATTACHMENTS]', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
