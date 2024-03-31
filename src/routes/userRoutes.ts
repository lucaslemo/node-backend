import express, { type Request, type Response } from 'express'
import { Code } from '../enum/code.enum'
import { HttpResponse } from '../domain/responses'
import { Status } from '../enum/status.enum'

const UserRouter = express.Router()

UserRouter.get('/', async (req: Request, res: Response) => {
	req.prisma.user.findMany()
		.then(async (users) => {
			await req.prisma.$disconnect()
			const response = new HttpResponse(Code.OK, Status.OK, 'Lista dos usuários', {users: users})
			res.status(response.statusCode()).send(response)
		})
		.catch(async (e) => {
			console.error(e)
			await req.prisma.$disconnect()
			const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, e.message)
			res.status(response.statusCode()).send(response)
		})
})

UserRouter.post('/', async (req: Request, res: Response) => {
	req.prisma.user.create({
		data: {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			type: 'admin'
		},
	})
		.then(async (user) => {
			await req.prisma.$disconnect()
			const response = new HttpResponse(Code.CREATED, Status.CREATED, 'Usuário criado com sucesso!', {user: user})
			res.status(response.statusCode()).send(response)
		})
		.catch(async (e) => {
			console.error(e)
			await req.prisma.$disconnect()
			const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, e.message)
			res.status(response.statusCode()).send(response)
		})
})

export default UserRouter
