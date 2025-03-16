import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

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
				url: 'http://localhost:3000', // Локальный сервер
			},
		],
	},
	apis: ['./routes/*.js'], // Путь к файлам с маршрутами, где будут комментарии Swagger
}

const swaggerSpec = swaggerJsDoc(options)

export { swaggerUi, swaggerSpec }
