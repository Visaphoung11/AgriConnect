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
            "userName",
            "age",
            "phone",
          ],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            userName: { type: "string", example: "john123" },
            age: { type: "number", example: 25 },
            phone: { type: "string", example: "+85512345678" },
          },
        },

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
      },
    },
  },

  // IMPORTANT: Swagger must scan your TypeScript routes
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
