'use client';

import { deleteThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

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
    // if (!parentId || !isReply) {
    //   router.push('/');
    // }
  };

  return (
    <Image
      src="/assets/delete.svg"
      alt="delte"
      width={18}
      height={18}
      className="action-icon"
      onClick={handleDelete}
    />
  );
};

export default DeleteThread;
