import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  thickness: string;
  pricePerSqM: number;
  image: string;
  useCases: string[];
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, width: number, length: number, totalPrice: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [width, setWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePrice = () => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    if (w > 0 && l > 0) {
      return (w * l * product.pricePerSqM).toFixed(2);
    }
    return '0.00';
  };

  const totalPrice = calculatePrice();
  const area = width && length ? (parseFloat(width) * parseFloat(length)).toFixed(2) : '0';

  const handleAddToCart = () => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    
    if (w > 0 && l > 0) {
      setIsCalculating(true);
      setTimeout(() => {
        onAddToCart(product, w, l, parseFloat(totalPrice));
        setIsCalculating(false);
        // Reset form
        setWidth('');
        setLength('');
      }, 500);
    }
  };

  return (
    <Card className="card-hover group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-grass-light to-grass-medium overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <CardTitle className="text-white text-lg font-semibold">{product.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {product.thickness}mm thick
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{product.description}</p>
        
        {/* Use Cases */}
        <div>
          <h4 className="font-medium text-sm mb-2">Perfect for:</h4>
          <div className="flex flex-wrap gap-1">
            {product.useCases.map((useCase, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price per m²:</span>
            <span className="text-lg font-bold text-primary">KES {product.pricePerSqM.toLocaleString()}</span>
          </div>
        </div>

        {/* Customization */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Calculator className="w-4 h-4 text-primary" />
            <span>Customize Dimensions</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`width-${product.id}`} className="text-xs">Width (m)</Label>
              <Input
                id={`width-${product.id}`}
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
              <Label htmlFor={`length-${product.id}`} className="text-xs">Length (m)</Label>
              <Input
                id={`length-${product.id}`}
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

          {/* Calculation Results */}
          {(width && length) && (
            <div className="bg-accent/10 p-3 rounded-lg space-y-1 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span>Area:</span>
                <span className="font-medium">{area} m²</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total:</span>
                <span>KES {totalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={!width || !length || parseFloat(width) <= 0 || parseFloat(length) <= 0 || isCalculating}
          className="w-full btn-bounce"
        >
          {isCalculating ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;