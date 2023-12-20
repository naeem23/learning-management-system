'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Editor } from '../editor';
import { Preview } from '../preview';

const formSchema = z.object({
    description: z.string().min(1, {
        message: 'Description is required',
    }),
});

export const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
}) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values) => {
        try {
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}`,
                values
            );
            toast.success('Chapter updated!');
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error('Something went error!');
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <p className="font-semibold">Chapter description</p>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {isEditing ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            ) : (
                <div
                    className={cn(
                        'text-sm mt-2',
                        !initialData.description && 'text-slate-500 italic'
                    )}
                >
                    {!initialData.description && 'No description'}
                    {initialData.description && (
                        <Preview value={initialData.description} />
                    )}
                </div>
            )}
        </div>
    );
};
