import { Request, Response } from "express";
import {
  CreateRole,
  GetAllRoles,
  GetRoleById,
  UpdateRole,
  DeleteRole,
} from "@/services/roleService";
import { IRole } from "@/types/role";

export const createRole = async (req: Request, res: Response) => {
  try {
    const roleData: IRole = req.body;
    const role = await CreateRole(roleData);

    res.status(201).json({
      message: "Role created successfully",
      role,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to create role",
    });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const result = await GetAllRoles();

    res.status(200).json({
      message: "Roles retrieved successfully",
      count: result.count,
      roles: result.roles,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to retrieve roles",
    });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await GetRoleById(id);

    res.status(200).json({
      message: "Role retrieved successfully",
      role,
    });
  } catch (error: any) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Invalid")
    ) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to retrieve role" });
    }
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<IRole> = req.body;
    const role = await UpdateRole(id, updateData);

    res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (error: any) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Invalid")
    ) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("already exists")) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to update role" });
    }
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await DeleteRole(id);

    res.status(200).json({
      message: "Role deleted successfully",
      role,
    });
  } catch (error: any) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Invalid")
    ) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("Cannot delete")) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete role" });
    }
  }
};
