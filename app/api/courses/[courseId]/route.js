import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized!', { status: 401 });
        }

        if (!courseId) {
            return new NextResponse('Course ID is required', { status: 400 });
        }

        const course = await prismadb.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log('[COURSE_ID]', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
