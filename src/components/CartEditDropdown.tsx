import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, Check, X } from 'lucide-react';

interface CartEditDropdownProps {
  item: {
    id: string;
    name: string;
    width: number;
    length: number;
    pricePerSqM: number;
  };
  onSave: (itemId: string, newWidth: number, newLength: number) => void;
}

const CartEditDropdown = ({ item, onSave }: CartEditDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(item.width.toString());
  const [length, setLength] = useState(item.length.toString());

  const handleSave = () => {
    const newWidth = parseFloat(width);
    const newLength = parseFloat(length);
    
    if (newWidth > 0 && newLength > 0) {
      onSave(item.id, newWidth, newLength);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setWidth(item.width.toString());
    setLength(item.length.toString());
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Update the width and length for {item.name}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width" className="text-xs">Width (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="0.0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="length" className="text-xs">Length (m)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                min="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="0.0"
                className="mt-1"
              />
            </div>
          </div>

          {/* Preview */}
          {width && length && parseFloat(width) > 0 && parseFloat(length) > 0 && (
            <div className="bg-accent/10 p-3 rounded-lg">
              <div className="text-sm font-medium">New calculation:</div>
              <div className="text-xs text-muted-foreground">
                {width}m × {length}m = {(parseFloat(width) * parseFloat(length)).toFixed(1)}m²
              </div>
              <div className="text-sm font-bold text-primary">
                KES {(parseFloat(width) * parseFloat(length) * item.pricePerSqM).toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!width || !length || parseFloat(width) <= 0 || parseFloat(length) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-3 h-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartEditDropdown;