import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
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
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const attachment = await prismadb.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log('[ATTACHMENT ID]', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
