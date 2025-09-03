import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "検索",
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 bg-white/95 backdrop-blur rounded-lg shadow-sm border px-3 ${className}`}>
      <Search className="w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full py-2 text-sm outline-none bg-transparent"
      />
    </div>
  );
};

export default SearchInput;