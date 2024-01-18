'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteThread } from '@/lib/actions/thread.actions';

type TDeleteThreadProps = {
  id: string;
  userId: string | null;
  authorId: string;
  parentId: string | null;
  isReply?: boolean;
};

const DeleteThread = ({
  id,
  userId,
  authorId,
  parentId,
  isReply,
}: TDeleteThreadProps) => {
  const pathname = usePathname();
  const router = useRouter();

  if (!userId || !authorId || userId !== authorId) return null;

  const handleDelete = async () => {
    await deleteThread(id, pathname);
    if (!parentId || !isReply) {
      router.push('/');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image
          src="/assets/delete.svg"
          alt="delte"
          width={18}
          height={18}
          className="action-icon"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            thread and all their descendants from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteThread;
