import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InquiryFormData, InquiryType } from '@/types';

interface InquiryFormProps {
    products: Array<{ id: string; name: string; price: number }>;
    onSubmit: (data: InquiryFormData) => void;
}

export function InquiryForm({ products, onSubmit }: InquiryFormProps) {
    const { register, handleSubmit, watch, setValue } = useForm<InquiryFormData>();
    const inquiryType = watch('type');
    const selectedProduct = watch('productId');
    const suggestedPrice = watch('suggestedPrice');
    const bargainPrice = watch('bargainPrice');

    useEffect(() => {
        // register form fields so Select-driven values are included
        register('type', { required: true });
        register('productId', { required: true });
        register('quantity');
        register('suggestedPrice');
        register('message', { required: true });
        register('bargainPrice');
    }, [register]);

    const selectedProductPrice = products.find(p => p.id === selectedProduct)?.price;

    const formattedCurrentPrice = selectedProductPrice ? selectedProductPrice.toLocaleString() : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Inquiry Type</Label>
                        <Select
                            value={inquiryType}
                            onValueChange={(value) => setValue('type', value as InquiryType, { shouldValidate: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Inquiry Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRICE">Price Inquiry</SelectItem>
                                <SelectItem value="STOCK">Stock Availability</SelectItem>
                                <SelectItem value="BULK_PRICING">Bulk Pricing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Product</Label>
                        <Select
                            value={selectedProduct}
                            onValueChange={(value) => setValue('productId', value, { shouldValidate: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(product => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name} - KES {product.price}/m²
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(inquiryType === 'BULK_PRICING' || inquiryType === 'STOCK') && (
                        <div className="space-y-2">
                            <Label>Quantity (m²)</Label>
                            <Input
                                type="number"
                                {...register('quantity')}
                                placeholder="Enter quantity needed"
                            />
                        </div>
                    )}

                    {selectedProduct && inquiryType === 'PRICE' && (
                        <div className="space-y-2">
                            <Label>Suggest Price (KES/m²)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={suggestedPrice ?? ''}
                                    onChange={(e) => setValue('suggestedPrice', e.target.value === '' ? undefined : Number(e.target.value))}
                                    placeholder={
                                        formattedCurrentPrice
                                            ? `Current: KES ${formattedCurrentPrice}`
                                            : 'Current: N/A'
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (selectedProductPrice) {
                                            const suggested = Math.round(selectedProductPrice * 0.9);
                                            setValue('suggestedPrice', suggested);
                                        }
                                    }}
                                    disabled={!selectedProductPrice}
                                >
                                    Suggest 10% Off
                                </Button>
                            </div>
                        </div>
                    )}

                    {selectedProduct && (inquiryType === 'PRICE' || inquiryType === 'BULK_PRICING') && (
                        <div className="space-y-2">
                            <Label>Bargain Price (KES/m²)</Label>
                            <Input
                                type="number"
                                value={bargainPrice ?? ''}
                                onChange={(e) => setValue('bargainPrice', e.target.value === '' ? undefined : Number(e.target.value))}
                                placeholder={
                                    formattedCurrentPrice
                                        ? `Current: KES ${formattedCurrentPrice}`
                                        : 'Current: N/A'
                                }
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                            {...register('message')}
                            placeholder="Enter your inquiry details..."
                            className="h-24"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Submit Inquiry
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}