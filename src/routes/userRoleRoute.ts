import { Router } from "express";
import { 
  assignRoleToUser, 
  removeRoleFromUser, 
  removeUserRoleById,
  getUserRoles,
  getUsersWithRole
} from "@/controllers/userRoleController";
import { roleCheck } from "@/middlewares/roleMiddleware";
import { UserRole } from "@/enum";

const router = Router();

/**
 * @swagger
 * /api/v1/user-roles:
 *   post:
 *     summary: Assign a role to a user (Admin only)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignRoleRequest'
 *     responses:
 *       201:
 *         description: Role assigned to user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role assigned to user successfully"
 *                 userRole:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     roleId:
 *                       type: string
 *                     assignedAt:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     roleName:
 *                       type: string
 *       400:
 *         description: Bad request - role already assigned or invalid data
 *       404:
 *         description: User or role not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/", roleCheck([UserRole.ADMIN]), assignRoleToUser);

/**
 * @swagger
 * /api/v1/user-roles:
 *   delete:
 *     summary: Remove a role from a user (Admin only)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignRoleRequest'
 *     responses:
 *       200:
 *         description: Role removed from user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role removed from user successfully"
 *       404:
 *         description: Role assignment not found
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/", roleCheck([UserRole.ADMIN]), removeRoleFromUser);

/**
 * @swagger
 * /api/v1/user-roles/{userRoleId}:
 *   delete:
 *     summary: Remove a role from user by assignment ID (Admin only)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userRoleId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Role assignment removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role assignment removed successfully"
 *       404:
 *         description: User role assignment not found
 *       400:
 *         description: Invalid userRoleId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:userRoleId", roleCheck([UserRole.ADMIN]), removeUserRoleById);

/**
 * @swagger
 * /api/v1/user-roles/users/{userId}/roles:
 *   get:
 *     summary: Get roles for a specific user (Admin/Staff)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012347"
 *     responses:
 *       200:
 *         description: User roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User roles retrieved successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       roleId:
 *                         type: string
 *                       roleName:
 *                         type: string
 *                       roleDescription:
 *                         type: string
 *                       assignedAt:
 *                         type: string
 *                 count:
 *                   type: number
 *                   example: 2
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid userId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Staff access required
 */
router.get("/users/:userId/roles", roleCheck([UserRole.ADMIN]), getUserRoles);

/**
 * @swagger
 * /api/v1/user-roles/roles/{roleId}/users:
 *   get:
 *     summary: Get users who have a specific role (Admin/Staff)
 *     tags: [User Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Users with role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users with role retrieved successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       assignedAt:
 *                         type: string
 *                 count:
 *                   type: number
 *                   example: 5
 *       404:
 *         description: Role not found
 *       400:
 *         description: Invalid roleId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Staff access required
 */
router.get("/roles/:roleId/users", roleCheck([UserRole.ADMIN]), getUsersWithRole);

export default router;
