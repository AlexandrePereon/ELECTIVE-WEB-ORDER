import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const swaggerRouter = express.Router();

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A sample API',
    },
    servers: [
      {
        url: process.env.BASE_URI,
      },
    ],
  },
  // Path to the API docs
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const customCss = `
  .swagger-ui .topbar { display: none }
`;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Use a valid JWT token with the 'Bearer' prefix for authentication.
 */
swaggerRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss }));

export default swaggerRouter;
