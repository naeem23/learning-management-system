import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import {
    CircleDollarSign,
    File,
    LayoutDashboard,
    ListChecks,
} from 'lucide-react';

import { getCourse } from '@/actions';
import { IconBadge } from '@/components/icon-badge';
import { TitleForm } from '@/components/courses/title-form';
import { DescriptionForm } from '@/components/courses/description-form';
import { ImageForm } from '@/components/courses/image-form';
import prismadb from '@/lib/prismadb';
import { CategoryForm } from '@/components/courses/category-form';
import { PriceForm } from '@/components/courses/price-form';
import { AttachmentForm } from '@/components/courses/attachment-form';
import { ChaptersForm } from '@/components/courses/chapters-form';
import { Banner } from '@/components/banner';
import { Actions } from '@/components/courses/actions';
import { boolean } from 'zod';

const CoursePage = async ({ params }) => {
    const { userId } = auth();

    if (!userId) {
        return redirect('/');
    }

    const course = await getCourse(params.courseId);
    const categories = await prismadb.category.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    if (!course) {
        return redirect('/');
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const complitionText = `${completedFields}/${totalFields}`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner label="This course is unpublished. It will not be visible to the students." />
            )}

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Course setup</h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {complitionText}
                        </span>
                    </div>

                    <Actions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Customize your course</h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">Course chapters</h2>
                            </div>
                            <ChaptersForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className="text-xl">Sell your course</h2>
                            </div>

                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Resources & Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoursePage;
