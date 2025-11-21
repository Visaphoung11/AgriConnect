import { Request, Response } from 'express';
import * as orderService from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  // Get customer ID from authenticated user
  const customerId = (req as any).user.id;
  const result = await orderService.CreateOrder(req.body, customerId);
  return res.status(result.status).json(result);
};

export const getOrders = async (req: Request, res: Response) => {
  const result = await orderService.GetOrders(req.query);
  return res.status(result.status).json(result);
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await orderService.GetOrderById(id);
  return res.status(result.status).json(result);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required',
    });
  }
  
  const result = await orderService.UpdateOrderStatus(id, status);
  return res.status(result.status).json(result);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await orderService.DeleteOrder(id);
  return res.status(result.status).json(result);
};
