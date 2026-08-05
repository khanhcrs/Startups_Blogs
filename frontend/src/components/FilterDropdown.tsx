import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FilterDropdown.module.css';

type DropdownProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

const FilterDropdown = ({ label, value, options, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  
  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = value === 'all' ? label : selectedOption?.label || label;

  return (
    <div className={styles.dropdownContainer} ref={containerRef}>
      <button 
        type="button"
        className={`${styles.filterDropdown} ${value !== 'all' ? styles.activeFilterButton : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {displayLabel} <ChevronDown size={16}/>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              className={`${styles.dropdownItem} ${value === opt.value ? styles.activeDropdownItem : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
