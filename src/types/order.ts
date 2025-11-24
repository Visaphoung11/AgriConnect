import { Types } from "mongoose";
import { IOrderItem } from "./orderItem";


export interface IOrder{
    customerId: Types.ObjectId;
      customerName: string;
      phone: string;
      address: string;
      total: number;
      status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      items: IOrderItem[];
      createdAt: Date;
      updatedAt: Date;
}