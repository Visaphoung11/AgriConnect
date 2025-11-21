import { Router } from 'express';
import { 
  getOrderItemsByOrderId, 
  getOrderItemById, 
  updateOrderItem, 
  deleteOrderItem 
} from '../controllers/orderItemController';
import { roleCheck } from '@/middlewares/roleMiddleware';
import { UserRole } from '@/enum';

const router = Router();

// Apply authentication middleware to all routes
router.use(roleCheck([UserRole.ADMIN, UserRole.FARMER, UserRole.SELLER, UserRole.BUYER]));

/**
 * @swagger
 * /api/v1/order-items/order/{orderId}:
 *   get:
 *     summary: Get all order items for a specific order
 *     description: Admin/Seller can see all order items, Buyers can only see their own order items
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to get items for
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to view these order items
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/order/:orderId', getOrderItemsByOrderId);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   get:
 *     summary: Get a specific order item by ID
 *     description: Admin/Seller can see any order item, Buyers can only see their own
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to view this order item
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getOrderItemById);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   put:
 *     summary: Update an order item (Admin/Seller only)
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 description: New quantity for the order item
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: New price per unit (Admin only)
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 description: New status for the order item
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Seller access required
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Server error
 */
router.put('/:id', roleCheck([UserRole.ADMIN, UserRole.SELLER]), updateOrderItem);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   delete:
 *     summary: Delete an order item (Admin only)
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item deleted successfully
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
 *         description: Order item not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', roleCheck([UserRole.ADMIN]), deleteOrderItem);

export default router;
