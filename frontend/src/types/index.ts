export interface IItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  paymentStatus: 'pending' | 'paid';
}

export interface ISale {
  _id: string;
  date: string;
  buyerName: string;
  items: IItem[];
  paymentStatus: 'pending' | 'paid';
  deliveryStatus: 'pending' | 'delivered';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISalePayload {
  date: string;
  buyerName: string;
  items: Omit<IItem, '_id'>[];
  paymentStatus?: 'pending' | 'paid';
  deliveryStatus?: 'pending' | 'delivered';
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductPayload {
  name: string;
  price: number;
  quantity: number;
}
