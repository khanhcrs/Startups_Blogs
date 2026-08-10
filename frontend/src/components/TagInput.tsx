import React, { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const PREDEFINED_TAGS = [
  "AI", "Fintech", "B2B", "SaaS", "E-commerce", "Healthtech", 
  "Edtech", "Blockchain", "Web3", "Marketing", "Investment", 
  "Venture Capital", "Proptech", "Logistics", "Mobile App"
];

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder = "Add a tag..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableTags = PREDEFINED_TAGS.filter(t => 
    !tags.includes(t) && t.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        backgroundColor: '#fff',
        alignItems: 'center',
        minHeight: '42px',
        cursor: 'text'
      }} onClick={() => setShowSuggestions(true)}>
        {tags.map((tag, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(index); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#1d4ed8',
                padding: 0,
                marginLeft: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            minWidth: '120px',
            fontSize: '1rem',
            backgroundColor: 'transparent'
          }}
        />
        <button 
          type="button" 
          onClick={() => setShowSuggestions(!showSuggestions)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {showSuggestions && availableTags.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.25rem',
          backgroundColor: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 50,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {availableTags.map((tag) => (
            <div
              key={tag}
              onClick={() => addTag(tag)}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#334155',
                borderBottom: '1px solid #f1f5f9'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
