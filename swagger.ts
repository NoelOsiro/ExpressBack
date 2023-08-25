import { Express } from 'express-serve-static-core';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Your API Documentation',
      description: 'Description of your API endpoints',
      version: '1.0.0',
    },
  },
  apis: ['src/routes/*.ts'], // Path to your API route files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
