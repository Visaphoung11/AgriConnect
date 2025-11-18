import { Request, Response } from "express";
import {
  CreateRole,
  GetAllRoles,
  GetRoleById,
  UpdateRole,
  DeleteRole,
} from "@/services/roleService";


export const createRole = async (req: Request, res: Response) => {
  const result = await CreateRole(req.body);
  return res.status(result.status).json(result);
};

export const getAllRoles = async (req: Request, res: Response) => {
  const result = await GetAllRoles();
  return res.status(result.status).json(result);
};
export const getRoleById = async (req: Request, res: Response) => {
  const result = await GetRoleById(req.params.id);
  return res.status(result.status).json(result);
};
export const updateRole = async (req: Request, res: Response) => {
  const result = await UpdateRole(req.params.id, req.body);
  return res.status(result.status).json(result);
};
export const deleteRole = async (req: Request, res: Response) => {
  const result = await DeleteRole(req.params.id);
  return res.status(result.status).json(result);
};


