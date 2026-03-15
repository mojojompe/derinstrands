import mongoose, { Schema, Document } from 'mongoose';

export interface IItem {
  name: string;
  price: number;
  quantity: number;
  paymentStatus: 'pending' | 'paid';
}

export interface ISale extends Document {
  date: string;
  buyerName: string;
  items: IItem[];
  paymentStatus: 'pending' | 'paid';
  deliveryStatus: 'pending' | 'delivered';
  totalPrice: number; // Virtual
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { _id: false });

const SaleSchema: Schema = new Schema({
  date: { type: String, required: true },
  buyerName: { type: String, required: true },
  items: { type: [ItemSchema], default: [] },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  deliveryStatus: { type: String, enum: ['pending', 'delivered'], default: 'pending' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

SaleSchema.virtual('totalPrice').get(function (this: ISale) {
  if (!this.items) return 0;
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export default mongoose.model<ISale>('Sale', SaleSchema);
