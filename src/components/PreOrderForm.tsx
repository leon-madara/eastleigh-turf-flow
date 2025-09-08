import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types";

interface PreOrderFormProps {
    products: Product[];
    onSubmit: (data: any) => void;
}

export function PreOrderForm({ products, onSubmit }: PreOrderFormProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const calculateRemaining = (total: number, deposit: number, discount: number) => {
        const discountedTotal = total * (1 - discount / 100);
        return discountedTotal - deposit;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <Label>Product</Label>
                <Select onValueChange={(value) => register("productId").onChange({ target: { value } })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                                {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                    {...register("clientName", { required: "Client name is required" })}
                    placeholder="Enter client name"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Square Meters</Label>
                    <Input
                        type="number"
                        {...register("squareMeters", {
                            required: "Square meters is required",
                            min: { value: 1, message: "Minimum 1 square meter" }
                        })}
                        placeholder="Enter area"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Discount (%)</Label>
                    <Input
                        type="number"
                        {...register("discount", {
                            required: "Discount is required",
                            min: { value: 0, message: "Minimum 0%" },
                            max: { value: 100, message: "Maximum 100%" }
                        })}
                        placeholder="Enter discount"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Deposit Amount</Label>
                <Input
                    type="number"
                    {...register("depositAmount", {
                        required: "Deposit amount is required",
                        min: { value: 0, message: "Minimum 0" }
                    })}
                    placeholder="Enter deposit amount"
                />
            </div>

            <div className="space-y-2">
                <Label>Expected Delivery Date</Label>
                <div className="border rounded-md p-4">
                    <Calendar
                        mode="single"
                        selected={watch("expectedDeliveryDate")}
                        onSelect={(date) => register("expectedDeliveryDate").onChange({ target: { value: date } })}
                        disabled={(date) => date < new Date()}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full">Create Pre-order</Button>
        </form>
    );
}