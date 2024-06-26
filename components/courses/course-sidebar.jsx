import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import { CourseProgress } from '../course-progress'
import { CourseSidebarItem } from './course-sidebar-item'

export const CourseSidebar = async ({course, progressCount}) => {
    const {userId} = auth()

    if (!userId) return redirect("/")

    const purchase = await prismadb.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    });

    return (
        <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
            <div className='p-8 flex flex-col border-b'>
                <h1 className='font-semibold'>{course.title}</h1>
                {purchase && (
                    <div className='mt-10'>
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        /> 
                    </div>
                )}
            </div>

            <div className='flex flex-col w-full'>
                {course.chapters?.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    )
}