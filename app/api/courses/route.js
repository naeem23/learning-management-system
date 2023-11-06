import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized access!', { status: 401 });
        }

        const course = await prismadb.course.create({
            data: {
                userId,
                title,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log('[COURSES]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
