import { Request, Response } from "express";
import {
  GetAllUsers,
  GetUserById,
  UpdateUserProfile,
  DeleteUser,
  SearchUsers,
  GetUsersByRoleName,
} from "@/services/userService";

export const getUsers = async (req: Request, res: Response) => {
  const result = await GetAllUsers(req);
  return res.status(result.status).json(result);
};

export const getUserById = async (req: Request, res: Response) => {
  const result = await GetUserById(req);
  return res.status(result.status).json(result);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const result = await UpdateUserProfile(req);
  return res.status(result.status).json(result);
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await DeleteUser(req);
  return res.status(result.status).json(result);
};


export const searchUsers = async (req: Request, res: Response) => {
  const result = await SearchUsers(req);
  return res.status(result.status).json(result);
};

export const getUsersByRoleName = async (req: Request, res: Response) => {
  const result = await GetUsersByRoleName(req);
  return res.status(result.status).json(result);
};
