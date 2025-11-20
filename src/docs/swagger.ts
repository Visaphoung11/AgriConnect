import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AgriConnect API",
      version: "1.0.0",
      description: "API Documentation for AgriConnect",
    },

    components: {
      schemas: {
        RegisterUser: {
          type: "object",
          required: [
            "email",
            "password",
            "firstName",
            "lastName",
            // "userName",
            "age",
            "phone",
          ],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            // userName: { type: "string", example: "john123" },
            age: { type: "number", example: 25 },
            phone: { type: "string", example: "+85512345678" },
          },
        },

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@example.com" },
            password: { type: "string", example: "chang123456" },
          },
        },

        Role: {
          type: "object",
          required: ["name"],
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6789012345" },
            name: { type: "string", example: "Admin" },
            description: { type: "string", example: "System administrator" },
            createdAt: { type: "string", example: "2023-07-01T10:00:00.000Z" },
            updatedAt: { type: "string", example: "2023-07-01T10:00:00.000Z" },
          },
        },

        UserRole: {
          type: "object",
          required: ["userId", "roleId"],
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6789012346" },
            userId: { type: "string", example: "64a1b2c3d4e5f6789012347" },
            roleId: { type: "string", example: "64a1b2c3d4e5f6789012345" },
            assignedAt: { type: "string", example: "2023-07-01T10:00:00.000Z" },
          },
        },

        AssignRoleRequest: {
          type: "object",
          required: ["userId", "roleId"],
          properties: {
            userId: { type: "string", example: "64a1b2c3d4e5f6789012347" },
            roleId: { type: "string", example: "64a1b2c3d4e5f6789012345" },
          },
        },

        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6789012347" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            userName: { type: "string", example: "john123" },
            email: { type: "string", example: "john@example.com" },
            phone: { type: "string", example: "+85512345678" },
            age: { type: "number", example: 25 },
            createdAt: { type: "string", example: "2023-07-01T10:00:00.000Z" },
            updatedAt: { type: "string", example: "2023-07-01T10:00:00.000Z" },
            roles: {
              type: "array",
              items: { $ref: "#/components/schemas/UserRole" }
            },
            roleCount: { type: "number", example: 2 },
          },
        },

        UserWithRoles: {
          type: "object",
          properties: {
            id: { type: "string", example: "64a1b2c3d4e5f6789012347" },
            userName: { type: "string", example: "john123" },
            email: { type: "string", example: "john@example.com" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            roles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "64a1b2c3d4e5f6789012346" },
                  roleId: { type: "string", example: "64a1b2c3d4e5f6789012345" },
                  roleName: { type: "string", example: "Admin" },
                  roleDescription: { type: "string", example: "System administrator" },
                  assignedAt: { type: "string", example: "2023-07-01T10:00:00.000Z" },
                },
              },
            },
            roleCount: { type: "number", example: 2 },
          },
        },

        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error message" },
            error: { type: "string", example: "Detailed error information" },
          },
        },

        Success: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
      },

      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // IMPORTANT: Swagger must scan your TypeScript routes
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
