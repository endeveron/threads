'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { mainMenu } from '@/constants';

interface MainMenuLinksProps {}

const MainMenuLinks = (props: MainMenuLinksProps) => {
  const pathname = usePathname();

  return mainMenu.map((link) => {
    const route = link.route;
    const isActive =
      (pathname.includes(route) && route.length > 1) || pathname === route;

    return (
      <Link
        href={link.route}
        key={link.label}
        className={`main-menu_link${isActive ? ' bg-primary-500' : ''}`}
      >
        <Image
          src={link.imgURL}
          alt={link.label}
          width={24}
          height={24}
          sizes=""
        />
        <p>{link.label}</p>
      </Link>
    );
  });
};

export default MainMenuLinks;
