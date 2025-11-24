import mongoose from "mongoose";

export interface IProduct{
     userId: mongoose.Types.ObjectId;
      categoryId: mongoose.Types.ObjectId;
      name: string;
      description: string;
      price: number;
      stock: number;
      available: boolean;
      image: string[];
      createdAt: Date;
      updatedAt: Date;
}