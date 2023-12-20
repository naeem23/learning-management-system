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
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Editor } from '../editor';
import { Preview } from '../preview';
import { Checkbox } from '../ui/checkbox';

const formSchema = z.object({
    isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({ initialData, courseId, chapterId }) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree,
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
                <p className="font-semibold">Chapter access</p>
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
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make
                                            this chapter free for preview
                                        </FormDescription>
                                    </div>
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
                <p
                    className={cn(
                        'text-sm mt-2',
                        !initialData.isFree && 'text-slate-500 italic'
                    )}
                >
                    {initialData.isFree ? (
                        <>This chapter is free for preview.</>
                    ) : (
                        <>This chapter is not free.</>
                    )}
                </p>
            )}
        </div>
    );
};
