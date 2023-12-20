'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';

const formSchema = z.object({
    categoryId: z.string().min(1, {
        message: 'Name is required.',
    }),
});

export const CategoryForm = ({ initialData, courseId, options }) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || '',
        },
    });

    const onSubmit = async (values) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course updated!');
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong!');
        }
    };

    const { isSubmitting, isValid } = form.formState;
    const selectedOption = options.find(
        (option) => option.id === initialData.categoryId
    );

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex justify-between items-center">
                <p className="font-semibold">Category</p>
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            ) : (
                <p
                    className={cn(
                        'text-sm mt-2',
                        !initialData.categoryId && 'text-slate-500 italic'
                    )}
                >
                    {selectedOption?.name || 'No category'}
                </p>
            )}
        </div>
    );
};
