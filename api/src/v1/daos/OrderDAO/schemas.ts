import mongoose from 'mongoose';
import { OrderStatus } from 'shared/entities/Order';

export interface IOrderSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  authorId: string;
  status: OrderStatus;
  verifiedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  meta: {
    orderNumber: string;
    totalPrice: number;
    financingSource: string;
    deliveryAddress: string;
    deadline: string;
    feedbackContact: string;
    materiallyResponsible: string;
  };
  createdAt: Date;
  products: {
    id: string;
    quantity: number;
  }[];
}

export const ORDER_MODEL_NAME = 'Order';
export const ORDER_SCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  authorId: { type: String, required: true },
  status: { type: String, required: true },
  verifiedBy: { type: String, default: null },
  approvedBy: { type: String, default: null },
  rejectedBy: { type: String, default: null },
  meta: {
    orderNumber: { type: String, required: true },
    totalPrice: { type: String, required: true },
    financingSource: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deadline: { type: String, required: true },
    feedbackContact: { type: String, required: true },
    materiallyResponsible: { type: String },
  },
  createdAt: { type: Date, required: true },
  products: [
    {
      id: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});
