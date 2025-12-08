
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useWisata } from '@/hooks/useWisata';

const categories = [
  'Semua Kategori',
  'Pantai',
  'Air Terjun',
  'Pura',
  'Danau',
  'Bukit',
  'Desa Wisata',
  'Budaya',
  'Kuliner'
];

const SearchFilters: React.FC = () => {
  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory } = useWisata();

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
        
        <div className="md:w-64">
          <Select
            value={selectedCategory || 'Semua Kategori'}
            onValueChange={(value) => setSelectedCategory(value === 'Semua Kategori' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
