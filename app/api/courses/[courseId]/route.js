import Mux from '@mux/mux-node';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
);

export async function DELETE(req, { params }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const course = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse('Not found', { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await prismadb.course.delete({
            where: {
                id: params.courseId,
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log('COURSE_DELETE', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

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
