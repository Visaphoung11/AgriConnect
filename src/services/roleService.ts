import { Types } from "mongoose";
import { RoleModel } from "@/models/roleModel";
import { UserRoleModel } from "@/models/UserRoleModel";
import { IRole } from "@/types/role";


export const CreateRole = async (roleData: IRole) => {
  try {
    const existingRole = await RoleModel.findOne({ name: roleData.name });
    if (existingRole) {
      throw new Error("Role with this name already exists");
    }

    const role = new RoleModel(roleData);
    await role.save();
    return role;
  } catch (error) {
    throw error;
  }
};


export const GetAllRoles = async (page = 1, limit = 10, search = "") => {
  try {
    const roles = await RoleModel.find().sort({ createdAt: -1 });
    return {
      roles,
      count: roles.length,
    };
  } catch (error) {
    throw error;
  }
};


export const GetRoleById = async (roleId: string) => {
  try {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new Error("Invalid role ID format");
    }

    const role = await RoleModel.findById(roleId);
    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  } catch (error) {
    throw error;
  }
};


export const UpdateRole = async (
  roleId: string,
  updateData: Partial<IRole>
) => {
  try {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new Error("Invalid role ID format");
    }

    if (updateData.name) {
      const existingRole = await RoleModel.findOne({
        name: updateData.name,
        _id: { $ne: roleId },
      });
      if (existingRole) {
        throw new Error("Role with this name already exists");
      }
    }

    const role = await RoleModel.findByIdAndUpdate(roleId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  } catch (error) {
    throw error;
  }
};


export const DeleteRole = async (roleId: string) => {
  try {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new Error("Invalid role ID format");
    }

    const roleAssignments = await UserRoleModel.find({ roleId });
    if (roleAssignments.length > 0) {
      throw new Error("Cannot delete role that is assigned to users");
    }

    const role = await RoleModel.findByIdAndDelete(roleId);
    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  } catch (error) {
    throw error;
  }
};
