import { SwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: SwaggerOptions = {
  openapi: {
    openapi: '3.0.3',
    info: {
      title: `Passman API's`,
      description: `Passman Backend API's`,
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          name: 'session',
          in: 'cookie',
        },
      },
    },
  },
};

export const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
};
