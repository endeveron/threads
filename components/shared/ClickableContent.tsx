'use client';

import { useRouter } from 'next/navigation';
import { WithChildren } from '@/lib/types/component.types';

type TClickableContentProps = WithChildren & {
  id: string;
  navLink?: string;
};

const ClickableContent = ({
  id,
  navLink,
  children,
}: TClickableContentProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    if (!navLink) return;
    router.push(navLink);
  };

  return (
    <div
      className={`clickable-content${!!navLink ? ' cursor-pointer' : ''}`}
      onClick={handleNavigate}
    >
      {children}
    </div>
  );
};

export default ClickableContent;
