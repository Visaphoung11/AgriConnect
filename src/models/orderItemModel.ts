import mongoose, { Schema } from 'mongoose';
import { IOrderItem } from '@/types/orderItem';

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model<IOrderItem>('OrderItem', orderItemSchema);
