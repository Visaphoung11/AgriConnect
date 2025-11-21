import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';


export const createCategory = async (req: Request, res: Response) => {
  const result = await categoryService.CreateCategory(req.body);
  return res.status(result.status).json(result);
};

export const getCategories = async (req: Request, res: Response) => {
  const result = await categoryService.GetCategories();
  return res.status(result.status).json(result);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.GetCategoryById(id);
  return res.status(result.status).json(result);
};


export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.UpdateCategory(id, req.body);
  return res.status(result.status).json(result);
};


export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.DeleteCategory(id);
  return res.status(result.status).json(result);
};
