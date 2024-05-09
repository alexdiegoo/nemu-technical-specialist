export interface ProductData {
    id: string;
    transactionId: string;
    name: string;
    value: number;
    status: string;
    quantity: number;
    paymentType: string;
    campaign: string;
    content: string;
    medium: string;
    term: string;
    src: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    date: string;
    gross_value: number;
    origin: string;
  }
  