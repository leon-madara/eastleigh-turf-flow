export const sendWhatsAppMessage = async (phone: string, message: string) => {
    // TODO: Integrate with WhatsApp Business API
    const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
    });
    return response.json();
};

export const generateOrderMessage = (orders: any[], total: number) => {
    const orderDetails = orders.map(order =>
        `${order.product} (${order.squareMeters}m²) - KES ${order.total.toLocaleString()}`
    ).join('\n');

    return `🟢 New Order Summary:\n\n${orderDetails}\n\nTotal: KES ${total.toLocaleString()}`;
};

export const generatePaymentReminder = (clientName: string, amount: number, dueDate: string) => {
    return `Hi ${clientName},\nThis is a reminder that payment of KES ${amount.toLocaleString()} is due on ${dueDate}. Please complete your payment to proceed with your order.`;
};

export const generateStatusUpdate = (clientName: string, status: string, orderDetails: string) => {
    return `Hi ${clientName},\nYour order status has been updated to: ${status}\n\nOrder Details:\n${orderDetails}`;
};