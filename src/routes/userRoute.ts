import { Router } from "express";
import { getUsers, getUserById } from "@/controllers/userController";
import { roleCheck } from "@/middlewares/roleMiddleware";
import { UserRole } from "@/enum";
const router = Router();

// Apply role check middleware to all routes (Admin/Staff only)
router.use(roleCheck([UserRole.ADMIN]));

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List users with pagination and search (Admin/Staff)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by username, email, first name, or last name
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserWithRoles'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Staff access required
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID with roles (Admin/Staff)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012347"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid userId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Staff access required
 */
router.get("/:id", getUserById);

export default router;
