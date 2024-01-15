'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '../ui/input';
import useDebouncedValue from '@/lib/utils/hooks';

interface SearchbarProps {
  routeType: string;
}

const SearchBar = ({ routeType }: SearchbarProps) => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue<string>(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/${routeType}?q=` + search);
    } else {
      router.push(`/${routeType}`);
    }
  }, [debouncedSearch, routeType]);

  return (
    <div className="search-bar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== 'search' ? 'Search communities' : 'Search creators'
        }`}
        className="no-focus search-bar_input"
      />
    </div>
  );
};

export default SearchBar;
