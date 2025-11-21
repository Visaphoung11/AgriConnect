import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController';
import { roleCheck, authenticate } from '@/middlewares/roleMiddleware';
import { UserRole } from '@/enum';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create order - only BUYER can create orders
router.post(
  "/",
  roleCheck([UserRole.ADMIN, UserRole.FARMER, UserRole.SELLER]),
  createOrder
);

// Get all orders - ADMIN, FARMER, and SELLER can view all orders
router.get(
  '/',
  roleCheck([UserRole.ADMIN, UserRole.FARMER, UserRole.SELLER]),
  getOrders
);

// Get order by ID - ADMIN, FARMER, SELLER, or the BUYER who owns the order
router.get(
  '/:id',
  roleCheck([UserRole.ADMIN, UserRole.FARMER, UserRole.SELLER, UserRole.BUYER]),
  getOrderById
);

// Update order status - ADMIN, FARMER, or SELLER can update status
router.patch(
  '/:id/status',
  roleCheck([UserRole.ADMIN, UserRole.FARMER, UserRole.SELLER]),
  updateOrderStatus
);

// Delete order - only ADMIN can delete orders
router.delete(
  '/:id',
  roleCheck([UserRole.ADMIN]),
  deleteOrder
);



/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - phone
 *               - address
 *               - items
 *             example:
 *               customerName: "John Doe"
 *               phone: "+85512345678"
 *               address: "123 Street Name, Phnom Penh, Cambodia"
 *               items:
 *                 - productId: "60d21b4667d0d8992e610c86"
 *                   quantity: 2
 *                 - productId: "60d21b4667d0d8992e610c87"
 *                   quantity: 1
 *                 - productId: "60d21b4667d0d8992e610c88"
 *                   quantity: 3
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Name of the customer
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: Customer phone number
 *                 example: "+85512345678"
 *               address:
 *                 type: string
 *                 description: Full shipping address
 *                 example: "123 Street Name, Phnom Penh, Cambodia"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product
 *                       example: "60d21b4667d0d8992e610c86"
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       description: Quantity of the product
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/', roleCheck([UserRole.BUYER]), createOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (Admin/Seller can see all, Buyer sees their own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID (Admin/Seller or order owner only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to view this order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin/Seller only for most statuses, Buyer can cancel pending orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [processing, shipped, delivered, cancelled]
 *                 description: New status of the order
 *               trackingNumber:
 *                 type: string
 *                 description: Tracking number (required when status is shipped)
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status transition or missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', updateOrderStatus);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', roleCheck([UserRole.ADMIN]), deleteOrder);

export default router;
