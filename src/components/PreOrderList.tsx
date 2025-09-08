import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { PreOrder } from "@/types";

interface PreOrderListProps {
    preOrders: PreOrder[];
    onStatusUpdate: (id: string, status: PreOrder['status']) => void;
    onBulkAction?: (ids: string[], action: 'approve' | 'reject' | 'combine') => void;
}

export function PreOrderList({ preOrders, onStatusUpdate, onBulkAction }: PreOrderListProps) {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const toggleOrderSelection = (id: string) => {
        setSelectedOrders(prev =>
            prev.includes(id)
                ? prev.filter(orderId => orderId !== id)
                : [...prev, id]
        );
    };

    const handleBulkAction = (action: 'approve' | 'reject' | 'combine') => {
        if (onBulkAction && selectedOrders.length > 0) {
            onBulkAction(selectedOrders, action);
            setSelectedOrders([]);
        }
    };

    const getStatusColor = (status: PreOrder['status']) => {
        const colors = {
            PENDING: 'bg-yellow-500',
            DEPOSIT_RECEIVED: 'bg-blue-500',
            AWAITING_BALANCE: 'bg-purple-500',
            READY: 'bg-green-500',
            COMPLETED: 'bg-gray-500',
            CANCELLED: 'bg-red-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    return (
        <div className="space-y-4">
            {selectedOrders.length > 0 && (
                <Card className="p-4 bg-accent/5">
                    <div className="flex items-center justify-between">
                        <span>{selectedOrders.length} orders selected</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction('approve')}
                            >
                                Approve Selected
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction('combine')}
                            >
                                Combine Orders
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleBulkAction('reject')}
                            >
                                Reject Selected
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={selectedOrders.length === preOrders.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedOrders(preOrders.map(order => order.id));
                                    } else {
                                        setSelectedOrders([]);
                                    }
                                }}
                            />
                        </TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Square Meters</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Deposit</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {preOrders.map((preOrder) => (
                        <TableRow key={preOrder.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedOrders.includes(preOrder.id)}
                                    onCheckedChange={() => toggleOrderSelection(preOrder.id)}
                                />
                            </TableCell>
                            <TableCell>{preOrder.clientName}</TableCell>
                            <TableCell>{preOrder.productName}</TableCell>
                            <TableCell className="text-right">{preOrder.squareMeters}m²</TableCell>
                            <TableCell className="text-right">{preOrder.discount}%</TableCell>
                            <TableCell className="text-right">KES {preOrder.depositAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">KES {preOrder.remainingBalance.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge className={`${getStatusColor(preOrder.status)} text-white`}>
                                    {preOrder.status.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onStatusUpdate(preOrder.id, 'AWAITING_BALANCE')}
                                >
                                    Request Balance
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}