import { Request, Response } from "express";
import {
  AssignRoleToUser,
  RemoveRoleFromUser,
  RemoveUserRoleById,
  GetUserRoles,
  GetUsersWithRole,
  GetAllUserRoleAssignments,
} from "@/services/userRoleService";

export const assignRoleToUser = async (req: Request, res: Response) => {
  const result = await AssignRoleToUser(req);
  return res.status(result.status).json(result);
};

export const removeRoleFromUser = async (req: Request, res: Response) => {
  const result = await RemoveRoleFromUser(req);
  return res.status(result.status).json(result);
};

export const removeUserRoleById = async (req: Request, res: Response) => {
  const result = await RemoveUserRoleById(req);
  return res.status(result.status).json(result);
};

export const getUserRoles = async (req: Request, res: Response) => {
  const result = await GetUserRoles(req);
  return res.status(result.status).json(result);
};

export const getUsersWithRole = async (req: Request, res: Response) => {
  const result = await GetUsersWithRole(req);
  return res.status(result.status).json(result);
};

export const getAllUserRoleAssignments = async (req: Request, res: Response) => {
  const result = await GetAllUserRoleAssignments(req);
  return res.status(result.status).json(result);
};
