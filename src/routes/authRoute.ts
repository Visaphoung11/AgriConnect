import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/authController";
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: '#/components/schemas/RegisterUser'
 */
router.post("/register", registerController);

/* #swagger.tags = ['Auth']
   #swagger.summary = 'Login user'

   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/definitions/LoginUser" }
       }
     }
   }
   #swagger.responses[200] = {
     description: "Login successful, returns JWT token"
   }
*/
router.post("/login", loginController);

export default router;
