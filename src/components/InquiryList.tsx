import React from 'react';
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
        <div className="space-y-3">
            {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 border rounded-lg bg-background">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm text-muted-foreground">{formatDate(inquiry.createdAt)}</div>
                        <Badge variant="outline">{inquiry.type.replace('_', ' ')}</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-muted-foreground">Product</div>
                            <div className="font-medium">{inquiry.productName}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Suggested</div>
                            <div className="font-medium">
                                {inquiry.suggestedPrice !== undefined && inquiry.suggestedPrice !== null
                                    ? `KES ${inquiry.suggestedPrice.toLocaleString()}`
                                    : '-'}
                            </div>
                        </div>
                        {inquiry.bargainPrice !== undefined && (
                            <div>
                                <div className="text-xs text-muted-foreground">Bargain</div>
                                <div className="font-medium">KES {inquiry.bargainPrice.toLocaleString()}</div>
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <div className="text-xs text-muted-foreground">Message</div>
                            <div className="break-words">{inquiry.message}</div>
                        </div>
                        {inquiry.response && (
                            <div className="sm:col-span-2">
                                <div className="text-xs text-muted-foreground">Response</div>
                                <div className="break-words">{inquiry.response}</div>
                            </div>
                        )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <Badge className={`${getStatusColor(inquiry.status)} text-white`}>{inquiry.status}</Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStatusUpdate(inquiry.id, 'CLOSED')}
                            disabled={inquiry.status === 'CLOSED'}
                        >
                            {inquiry.status === 'PENDING' ? 'Mark Responded' : 'Close'}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}