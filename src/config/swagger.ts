import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriConnect API',
      version: '1.0.0',
      description: 'API documentation for AgriConnect - An agricultural products marketplace',
      contact: {
        name: 'AgriConnect Support',
        email: 'support@agriconnect.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        description: 'Current server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // User Role Assignment Schema
        AssignRoleRequest: {
          type: 'object',
          required: ['userId', 'roleId'],
          properties: {
            userId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85',
              description: 'ID of the user to assign the role to'
            },
            roleId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c86',
              description: 'ID of the role to assign to the user'
            }
          }
        },
        UserRole: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c87',
              description: 'Unique identifier for the user-role assignment'
            },
            userId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85',
              description: 'ID of the user'
            },
            roleId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c86',
              description: 'ID of the assigned role'
            },
            assignedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
              description: 'Timestamp when the role was assigned'
            },
            userName: {
              type: 'string',
              example: 'john.doe@example.com',
              description: 'Email of the user'
            },
            roleName: {
              type: 'string',
              example: 'ADMIN',
              description: 'Name of the assigned role'
            }
          }
        },
        // User Schemas
        RegisterUser: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'age', 'phone'],
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: '123456' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            age: { type: 'number', example: 25 },
            phone: { type: 'string', example: '+85512345678' },
          },
        },
        LoginUser: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@example.com' },
            password: { type: 'string', example: 'chang123456' },
          },
        },
        // Role Schemas
        RoleInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { 
              type: 'string', 
              example: 'MANAGER',
              description: 'Name of the role (must be unique)'
            },
            description: { 
              type: 'string', 
              example: 'Department manager role',
              description: 'Description of the role' 
            },
          },
        },
        RoleResponse: {
          type: 'object',
          properties: {
            status: { type: 'number', example: 201 },
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Role created successfully' },
            data: {
              $ref: '#/components/schemas/Role'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string', 
              example: '64a1b2c3d4e5f6789012345',
              description: 'Unique identifier for the role'
            },
            name: { 
              type: 'string', 
              example: 'MANAGER',
              description: 'Name of the role (must be unique)'
            },
            description: { 
              type: 'string', 
              example: 'Department manager role',
              description: 'Description of the role' 
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        
        // Category Schema
        Category: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the category',
              example: 'Vegetables',
            },
            description: {
              type: 'string',
              description: 'Description of the category',
              example: 'Fresh organic vegetables',
            },
          },
        },
        
        // Product Schema
        Product: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID of the user who owns the product',
              example: '60d21b4667d0d8992e610c85',
            },
            categoryId: {
              type: 'string',
              description: 'ID of the category this product belongs to',
              example: '60d21b4667d0d8992e610c86',
            },
            name: {
              type: 'string',
              description: 'Name of the product',
              example: 'Organic Tomatoes',
            },
            description: {
              type: 'string',
              description: 'Description of the product',
              example: 'Fresh organic tomatoes from local farm',
            },
            price: {
              type: 'number',
              description: 'Price of the product',
              example: 2.99,
            },
            stock: {
              type: 'integer',
              description: 'Available stock quantity',
              example: 100,
            },
            available: {
              type: 'boolean',
              description: 'Whether the product is available for purchase',
              example: true,
            },
            image: {
              type: 'string',
              description: 'URL to the product image',
              example: 'https://example.com/images/tomatoes.jpg',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            customerName: {
              type: 'string',
              description: 'Name of the customer',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              description: 'Customer phone number',
              example: '+1234567890',
            },
            address: {
              type: 'string',
              description: 'Delivery address',
              example: '123 Main St, City, Country',
            },
            total: {
              type: 'number',
              description: 'Total amount of the order',
              example: 29.95,
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'Current status of the order',
              example: 'pending',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'ID of the order this item belongs to',
              example: '60d21b4667d0d8992e610c87',
            },
            productId: {
              type: 'string',
              description: 'ID of the product',
              example: '60d21b4667d0d8992e610c88',
            },
            quantity: {
              type: 'integer',
              description: 'Quantity of the product',
              example: 2,
              minimum: 1,
            },
            subtotal: {
              type: 'number',
              description: 'Subtotal for this item (price * quantity)',
              example: 5.98,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  // Path to the API routes
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../models/*.ts')
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
