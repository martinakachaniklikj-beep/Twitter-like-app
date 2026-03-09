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

interface SearchBarProps {
  onUserSelect?: (user: SearchResult) => void;
}

export default function SearchBar({ onUserSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
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
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return searchServices.searchUsers(token, debouncedQuery);
    },
    enabled: debouncedQuery.trim().length >= 2,
  });

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2 && results.length >= 0) {
      setIsOpen(true);
    }
  }, [results, debouncedQuery]);

  const handleUserClick = (user: SearchResult) => {
    setQuery('');
    setIsOpen(false);

    if (onUserSelect) {
      onUserSelect(user);
      return;
    }

    router.push(`/profile/${user.username}`);
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
              <ResultItem key={user.id} onClick={() => handleUserClick(user)}>
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
