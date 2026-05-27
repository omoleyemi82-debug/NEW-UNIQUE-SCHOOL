import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface SearchableDropdownProps {
  id?: string;
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set focus on search when open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full text-left font-sans" ref={containerRef} id={id}>
      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Selector Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchQuery('');
          }
        }}
        className={`w-full flex items-center justify-between text-xs px-3 py-2 bg-slate-50 border rounded-lg outline-none cursor-pointer transition-all ${
          disabled ? 'opacity-65 bg-slate-100 cursor-not-allowed' : 'hover:border-slate-300'
        } ${isOpen ? 'border-[#1A365D] ring-1 ring-[#1A365D]/30 bg-white' : 'border-slate-200'}`}
      >
        <span className={`truncate ${value ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-600' : ''}`} />
      </button>

      {/* Floating Dropdown List Overlay */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Box */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border-b border-slate-100">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Start typing to look up..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 py-0.5"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Options list container */}
          <ul className="max-h-52 overflow-y-auto divide-y divide-slate-50 text-xs text-slate-700">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-3 text-slate-400 italic text-[11px] text-center">
                No matching results found
              </li>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = option === value;
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50/70 text-indigo-700 font-bold' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{option}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
