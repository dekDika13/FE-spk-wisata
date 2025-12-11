import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useApiDestinations } from '@/hooks/useApiDestinations';

// Search component for filtering destinations

const SearchFilters: React.FC = () => {
  const { searchTerm, setSearchTerm } = useApiDestinations();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari destinasi wisata..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
