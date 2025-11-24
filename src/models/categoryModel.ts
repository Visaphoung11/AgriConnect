import mongoose, { Schema } from 'mongoose';

import { ICategory } from '@/types/category';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
