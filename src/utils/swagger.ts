import { SwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: SwaggerOptions = {
	openapi: {
		openapi: '3.0.3',
		info: {
			title: `Passman API's`,
			description: `Passman Backend API's`,
			version: '1.0.0',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Development server',
			},
			{
				url: 'https://passman-be-production.up.railway.app',
				description: 'Production server',
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
		// Use `x-tagGroups` to group tags under a parent
		// @ts-ignore
		'x-tagGroups': [
			{
				name: "Default API's",
				tags: ['Default'],
			},
			{
				name: "User API's",
				tags: ['User', 'Auth'],
			},
			{
				name: "Password API's",
				tags: ['Password'],
			},
			{
				name: "Schema's",
				tags: ['Model'],
			},
		],
	},
};
