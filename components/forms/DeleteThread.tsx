'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/use-toast';
import { deleteThread } from '@/lib/actions/thread.actions';
import { ToastAction } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

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

  const toast = useToast();

  const handleDelete = async () => {
    // await deleteThread(id, pathname);
    // if (!parentId || !isReply) {
    //   router.push('/');
    // }

    console.log('delete');
  };

  return (
    <Image
      src="/assets/delete.svg"
      alt="delte"
      width={18}
      height={18}
      className="action-icon"
      onClick={() =>
        toast.toast({
          variant: 'destructive',
          title: 'Delete this thread?',
          description:
            'Once you delete, there is no going back. Please be certain.',
          action: (
            <Button onClick={handleDelete} className="button">
              Delete
            </Button>
          ),
          // duration: 6000000,
        })
      }
    />
  );
};

export default DeleteThread;
