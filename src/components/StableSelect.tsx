import React, { useState, useCallback, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ErrorBoundary from './ErrorBoundary';

interface StableSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const StableSelect: React.FC<StableSelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder, 
  children, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleValueChange = useCallback((newValue: string) => {
    onValueChange(newValue);
    setIsOpen(false);
  }, [onValueChange]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!disabled) {
      setIsOpen(open);
    }
  }, [disabled]);

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <ErrorBoundary>
      <Select 
        value={value} 
        onValueChange={handleValueChange}
        open={isOpen}
        onOpenChange={handleOpenChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {memoizedChildren}
        </SelectContent>
      </Select>
    </ErrorBoundary>
  );
};

export default StableSelect;
