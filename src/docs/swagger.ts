
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "AlgriConnect API",
    description: "API Documentation for AlgriConnect",
    version: "1.0.0",
  },
  host: "localhost:4000",
  basePath: "/api/v1",
  schemes: ["http"],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
  ],
  components: {
    schemas: {
      RegisterUser: {
        type: "object",
        required: ["email", "password", "firstName", "lastName", "userName", "age", "phone"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", example: "yourpassword123" },
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          userName: { type: "string", example: "johndoe123" },
          age: { type: "number", example: 25 },
          phone: { type: "string", example: "+1234567890" }
        }
      },
      LoginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", example: "yourpassword123" }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const outputFile = "./swagger.json";
// This is to point to your routes
const endpointsFiles = ["../routes/authRoute.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
