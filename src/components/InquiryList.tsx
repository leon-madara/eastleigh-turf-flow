import React from 'react';
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
import { Inquiry } from '@/types';

interface InquiryListProps {
    inquiries: Inquiry[];
    onStatusUpdate: (id: string, status: Inquiry['status']) => void;
}

export function InquiryList({ inquiries, onStatusUpdate }: InquiryListProps) {
    const getStatusColor = (status: Inquiry['status']) => {
        const colors = {
            PENDING: 'bg-yellow-500',
            RESPONDED: 'bg-blue-500',
            CLOSED: 'bg-gray-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Suggested</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Response</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                            <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {inquiry.type.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>{inquiry.productName}</TableCell>
                            <TableCell className="text-right">
                                {inquiry.suggestedPrice !== undefined && inquiry.suggestedPrice !== null
                                    ? `KES ${inquiry.suggestedPrice.toLocaleString()}`
                                    : '-'}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {inquiry.message}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {inquiry.response || '-'}
                            </TableCell>
                            <TableCell>
                                <Badge className={`${getStatusColor(inquiry.status)} text-white`}>
                                    {inquiry.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onStatusUpdate(inquiry.id, 'CLOSED')}
                                    disabled={inquiry.status === 'CLOSED'}
                                >
                                    {inquiry.status === 'PENDING' ? 'Mark Responded' : 'Close'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}