import { Types } from "mongoose";

export interface IUserRole {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  assignedAt: Date;
}
