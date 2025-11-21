import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  address: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    items: [{
      type: Schema.Types.ObjectId,
      ref: 'OrderItem'
    }]
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
