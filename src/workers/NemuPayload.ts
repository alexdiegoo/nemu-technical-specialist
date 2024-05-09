export interface NemuPayload {
    transaction_id: string;
    store_name: string;
    method: 'pix' | 'boleto' | 'credit_card';
    total_price: string;
    status: 'approved' | 'pending' | 'refused' | 'charge_back' | 'refunded' | 'canceled';
    created_at: string;
    checkout: Checkout;
    plans: Plan[];
    customer: Customer;
    address: Address;
  }
  
  interface Address {
    city: string;
    state: string;
    country: string;
    zip_code: string;
  }
  
  interface Customer {
    name: string;
    email: string;
    phone: string;
  }
  
  interface Checkout {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
  }
  
  interface Plan {
    id: string;
    name: string;
    value: string;
  }