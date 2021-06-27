import dotenv from 'dotenv';
dotenv.config();

//Swagger Configuration
export const swagger = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: `${process.env.VERSION}`,
      title: 'Expressify',
      description: 'Contains Endpoints of Expressify',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          required: true,
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          required: true,
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/${process.env.BASE_URL}/${process.env.VERSION}`,
        description: 'The Expressify API server',
        variables: {
          port: {
            enum: [`${process.env.PORT}`],
            default: `${process.env.PORT}`,
          },
          basePath: {
            default: `${process.env.BASE_URL}/${process.env.VERSION}`,
          },
        },
      },
    ],
  },

  apis: ['./routes/api-routes/**/*.js'],
};
