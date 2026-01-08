'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  Container,
  InputWrapper,
  SearchIcon,
  SearchInput,
  ResultsDropdown,
  ResultItem,
  Avatar,
  AvatarText,
  UserInfo,
  DisplayName,
  Username,
  EmptyResults,
} from './SearchBar.styles';
import { SearchResult } from './types';
import { searchLabels } from './utils/labels';
import { searchServices } from './services/searchServices';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const { data: results = [] } = useQuery<SearchResult[]>({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: () => searchServices.searchUsers(token!, debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2 && !!token,
  });

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2 && results.length >= 0) {
      setIsOpen(true);
    }
  }, [results, debouncedQuery]);

  const handleUserClick = (username: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/profile/${username}`);
  };

  return (
    <Container ref={searchRef}>
      <InputWrapper>
        <SearchIcon>
          <Search size={16} />
        </SearchIcon>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={searchLabels.placeholder}
        />
      </InputWrapper>

      {isOpen && debouncedQuery.trim().length >= 2 && (
        <ResultsDropdown>
          {results.length === 0 ? (
            <EmptyResults>{searchLabels.noResults}</EmptyResults>
          ) : (
            results.map((user) => (
              <ResultItem key={user.id} onClick={() => handleUserClick(user.username)}>
                <Avatar>
                  <AvatarText>{user.username[0].toUpperCase()}</AvatarText>
                </Avatar>
                <UserInfo>
                  <DisplayName>{user.displayName || user.username}</DisplayName>
                  <Username>@{user.username}</Username>
                </UserInfo>
              </ResultItem>
            ))
          )}
        </ResultsDropdown>
      )}
    </Container>
  );
}
