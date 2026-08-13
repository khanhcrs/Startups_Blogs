import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FilterDropdown.module.css';

type DropdownProps = {
  id?: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  alignRight?: boolean;
};

const FilterDropdown = ({
  id = '',
  label,
  value,
  options,
  onChange,
  isOpen: controlledIsOpen,
  onToggle,
  alignRight = false,
}: DropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && onToggle && id) {
      onToggle(id);
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const handleClose = useCallback(() => {
    if (isControlled && onToggle && id && isOpen) {
      onToggle(id);
    } else if (!isControlled) {
      setInternalIsOpen(false);
    }
  }, [isControlled, onToggle, id, isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isOpen) {
          handleClose();
        }
      }
    },
    [isOpen, handleClose],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    },
    [isOpen, handleClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  const selectedOption = options.find(
    (opt) =>
      opt.value === value ||
      (opt.value !== 'all' &&
        opt.value.toLowerCase() === value.toLowerCase()),
  );
  const displayLabel =
    value === 'all' || value === 'newest'
      ? label
      : selectedOption?.label || value;

  return (
    <div
      className={`${styles.dropdownContainer} ${isOpen ? styles.dropdownContainerOpen : ''}`}
      ref={containerRef}
    >
      <button
        type="button"
        className={`${styles.filterDropdown} ${value !== 'all' && value !== 'newest' ? styles.activeFilterButton : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {displayLabel} <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div
          className={`${styles.dropdownMenu} ${alignRight ? styles.alignRightMenu : ''}`}
          role="listbox"
        >
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
