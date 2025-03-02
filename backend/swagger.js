const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API для мероприятий и пользователей',
			version: '1.0.0',
			description:
				'Документация API для работы с мероприятиями и пользователями',
		},
		servers: [
			{ url: 'http://localhost:5000' },
			{
				url: 'http://localhost:3000',
			},
		],
	},
	apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJsDoc(options)

module.exports = { swaggerUi, swaggerSpec }
