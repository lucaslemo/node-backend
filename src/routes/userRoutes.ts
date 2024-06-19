import express, { type Request, type Response } from 'express'
import { Code } from '../enum/code.enum'
import { HttpResponse } from '../domain/responses'
import { Status } from '../enum/status.enum'
import argon2 from 'argon2'

const UserRouter = express.Router()

UserRouter.get('/', async (req: Request, res: Response) => {
	try {
		const users = await req.prisma.user.findMany();
		const response = new HttpResponse(Code.OK, Status.OK, 'Lista dos usuários', {users: users})
		res.status(response.statusCode()).send(response)

	} catch (error: any) {
		console.error(error)
		const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, error.message)
		res.status(response.statusCode()).send(response)

	} finally {
		await req.prisma.$disconnect()
		return
	}
});

UserRouter.post('/', async (req: Request, res: Response) => {
	try {
		const hash = await argon2.hash(req.body.password, { salt: Buffer.from(new Date().toISOString()) });
		const user = await req.prisma.user.create({
			data: {
				name: req.body.name,
				email: req.body.email,
				password: hash,
				type: 'admin'
			},
		});

		const response = new HttpResponse(Code.CREATED, Status.CREATED, 'Usuário criado com sucesso!', {user: user});
		res.status(response.statusCode()).send(response);

	} catch (error: any) {
		console.error(error)
		const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, error.message)
		res.status(response.statusCode()).send(response);

	} finally {
		await req.prisma.$disconnect()
		return
	}
})

export default UserRouter
