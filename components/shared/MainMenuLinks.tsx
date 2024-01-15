'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { mainMenu } from '@/constants';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

interface MainMenuLinksProps {}

const MainMenuLinks = (props: MainMenuLinksProps) => {
  const pathname = usePathname();
  const profilePath = '/profile';

  return mainMenu.map((link) => {
    let route = link.route;
    const isActive =
      (pathname.includes(route) && route.length > 1) || pathname === route;

    // Add user id to profile route
    if (route === profilePath) {
      const user = useAuth();
      route = `${profilePath}/${user.userId}`;
    }

    return (
      <Link
        href={route}
        key={link.label}
        className={cn('main-menu_link bg-hover', {
          'bg-primary-800 hover:bg-primary-800': isActive,
        })}
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
