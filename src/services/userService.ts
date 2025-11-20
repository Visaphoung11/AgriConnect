import { Types } from "mongoose";
import { UserModel } from "@/models/userModel";
import { UserRoleModel } from "@/models/UserRoleModel";
import { RoleModel } from "@/models/roleModel";

// Get all users with pagination
export const GetAllUsers = async (req: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let searchQuery: any = {};

    if (search) {
      searchQuery = {
        $or: [
          { userName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await UserModel.find(searchQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(searchQuery);

    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const userRoles = await UserRoleModel.find({ userId: user._id })
          .populate("roleId", "name description")
          .sort({ assignedAt: -1 });

        const roles = userRoles.map((ur) => ({
          id: ur._id,
          roleId: ur.roleId._id,
          roleName: (ur.roleId as any).name,
          roleDescription: (ur.roleId as any).description,
          assignedAt: ur.assignedAt,
        }));

        return {
          ...user.toObject(),
          roles,
          roleCount: roles.length,
        };
      })
    );

    return {
      status: 200,
      message: "Users retrieved successfully",
      users: usersWithRoles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

// Get user by ID

export const GetUserById = async (req: any) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return { status: 400, message: "Invalid user ID format" };
    }

    const user = await UserModel.findById(id).select("-password");
    if (!user) return { status: 404, message: "User not found" };

    const userRoles = await UserRoleModel.find({ userId: id })
      .populate("roleId", "name description")
      .sort({ assignedAt: -1 });

    const roles = userRoles.map((ur) => ({
      id: ur._id,
      roleId: ur.roleId._id,
      roleName: (ur.roleId as any).name,
      roleDescription: (ur.roleId as any).description,
      assignedAt: ur.assignedAt,
    }));

    return {
      status: 200,
      message: "User retrieved successfully",
      user: {
        ...user.toObject(),
        roles,
        roleCount: roles.length,
      },
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

/**
 * UPDATE USER PROFILE
 */
export const UpdateUserProfile = async (req: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return { status: 400, message: "Invalid user ID format" };
    }

    delete updateData.password;

    if (updateData.email || updateData.userName) {
      const exists = await UserModel.findOne({
        $or: [
          ...(updateData.email ? [{ email: updateData.email }] : []),
          ...(updateData.userName ? [{ userName: updateData.userName }] : []),
        ],
        _id: { $ne: id },
      });

      if (exists) {
        return {
          status: 400,
          message: "Email or Username already exists",
        };
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return { status: 404, message: "User not found" };

    return {
      status: 200,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

/**
 * DELETE USER
 */
export const DeleteUser = async (req: any) => {
  try {
    const { id } = req.params;
    const hardDelete = req.query.hardDelete === "true";

    if (!Types.ObjectId.isValid(id)) {
      return { status: 400, message: "Invalid user ID format" };
    }

    const user = await UserModel.findById(id);
    if (!user) return { status: 404, message: "User not found" };

    await UserRoleModel.deleteMany({ userId: id });

    if (hardDelete) {
      await UserModel.findByIdAndDelete(id);
    } else {
      await UserModel.findByIdAndUpdate(id, { isActive: false });
    }

    return { status: 200, message: "User deleted successfully" };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

/**
 * USER STATISTICS
 */
// export const GetUserStatistics = async () => {
//   try {
//     const totalUsers = await UserModel.countDocuments();
//     const activeUsers = await UserModel.countDocuments({
//       isActive: { $ne: false },
//     });

//     const roleStats = await UserRoleModel.aggregate([
//       { $group: { _id: "$roleId", count: { $sum: 1 } } },
//       {
//         $lookup: {
//           from: "roles",
//           localField: "_id",
//           foreignField: "_id",
//           as: "role",
//         },
//       },
//       { $unwind: "$role" },
//       { $project: { roleName: "$role.name", count: 1 } },
//     ]);

//     return {
//       status: 200,
//       message: "User statistics retrieved",
//       totalUsers,
//       activeUsers,
//       inactiveUsers: totalUsers - activeUsers,
//       roleDistribution: roleStats,
//     };
//   } catch (error: any) {
//     return { status: 500, message: error.message };
//   }
// };

/**
 * SEARCH USERS
 */
export const SearchUsers = async (req: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query: any = {};

    ["email", "userName", "firstName", "lastName"].forEach((key) => {
      if (req.query[key]) {
        query[key] = { $regex: req.query[key], $options: "i" };
      }
    });

    let users = await UserModel.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(query);

    return {
      status: 200,
      message: "Search results retrieved",
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

/**
 * GET USERS BY ROLE NAME
 */
export const GetUsersByRoleName = async (req: any) => {
  try {
    const { roleName } = req.params;

    const role = await RoleModel.findOne({ name: roleName });
    if (!role) return { status: 404, message: "Role not found" };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const roleUsers = await UserRoleModel.find({ roleId: role._id })
      .populate("userId", "userName email firstName lastName")
      .skip(skip)
      .limit(limit);

    const total = await UserRoleModel.countDocuments({ roleId: role._id });

    return {
      status: 200,
      message: "Users by role retrieved",
      role,
      users: roleUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
