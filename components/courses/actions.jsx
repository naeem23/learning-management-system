'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../modals/confirm-modal';
import { Button } from '../ui/button';
import {useConfettiStore} from '@/hooks/use-confetti-store';

export const Actions = ({ disabled, courseId, isPublished }) => {
    const router = useRouter();
    const confetti = useConfettiStore()

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success('Course unpublished');
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success('Course published');
                confetti.onOpen()
            }

            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success('Course deleted');
            router.refresh();
            router.push(`/teacher/courses`);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
                onClick={onClick}
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>

            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
