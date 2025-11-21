import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  const result = await productService.CreateProduct(req.body);
  return res.status(result.status).json(result);
};

export const getProducts = async (req: Request, res: Response) => {
  const result = await productService.GetProducts(req.query);
  return res.status(result.status).json(result);
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.GetProductById(id);
  return res.status(result.status).json(result);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.UpdateProduct(id, req.body);
  return res.status(result.status).json(result);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.DeleteProduct(id);
  return res.status(result.status).json(result);
};

export const updateProductStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, operation } = req.body;
  
  if (!['increment', 'decrement'].includes(operation)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid operation. Must be either "increment" or "decrement"',
    });
  }
  
  const result = await productService.UpdateProductStock(id, quantity, operation as 'increment' | 'decrement');
  return res.status(result.status).json(result);
};
