import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

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

        const attachment = await prismadb.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId: params.courseId,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log('[ATTACHMENTS]', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
