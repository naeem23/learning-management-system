import prismadb from "@/lib/prismadb";

export const getChapter = async ({userId, courseId, chapterId}) => {
    try {
        const purchase = await prismadb.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        const course = await prismadb.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
            select: {
                price: true
            }
        });

        const chapter = await prismadb.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            }
        });

        if (!chapter || !course) throw new Error("Chapter or course not found!");

        let muxData = null;
        let attachments = [];
        let nextChapter = null;

        if (purchase) {
            attachments = await prismadb.attachments.findMany({
                where: {
                    courseId,
                }
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await prismadb.muxData.findUnique({
                where: {
                    chapterId,
                }
            })

            nextChapter = await prismadb.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            });
        }

        const userProgress = await prismadb.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        })

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        };
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
    }
}