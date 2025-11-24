import mongoose, {  Schema } from 'mongoose';
import { IOrder } from '@/types/order';

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
