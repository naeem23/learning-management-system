import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT (req, {params}) {
    try {
        const {userId} = auth();
        const {isCompleted} = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const userProgress = await prismadb.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                },
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        });

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}