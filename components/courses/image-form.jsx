'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ImageIcon, ImagePlus } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: 'Image is required',
    }),
});

export const ImageForm = ({ initialData, courseId }) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course updated');
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong!');
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <p className="font-semibold">Course image</p>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Add image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Change image
                        </>
                    )}
                </Button>
            </div>

            {!isEditing &&
                (!initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="course image"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                ))}

            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
};
