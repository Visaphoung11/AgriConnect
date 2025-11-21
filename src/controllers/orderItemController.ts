import { Request, Response } from 'express';
import * as orderItemService from '../services/orderItemService';

export const getOrderItemsByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await orderItemService.GetOrderItemsByOrderId(orderId);
  return res.status(result.status).json(result);
};

export const getOrderItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await orderItemService.GetOrderItemById(id);
  return res.status(result.status).json(result);
};

export const updateOrderItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await orderItemService.UpdateOrderItem(id, req.body);
  return res.status(result.status).json(result);
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await orderItemService.DeleteOrderItem(id);
  return res.status(result.status).json(result);
};
