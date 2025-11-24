
import mongoose from "mongoose";


export interface IOrderItem {

    orderId: mongoose.Types.ObjectId;
      productId: mongoose.Types.ObjectId;
      quantity: number;
      subtotal: number;
      createdAt: Date;
      updatedAt: Date;
}