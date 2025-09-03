import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const GlobalSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/archive?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="h-9 w-9 p-0"
          aria-label="Search newsletters"
        >
          <Search className="h-4 w-4" />
        </Button>
      ) : (
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search newsletters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-3 pr-10"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GlobalSearchBar;