import express, { type Request, type Response } from 'express'
import { Code } from '../enum/code.enum'
import { HttpResponse } from '../domain/responses'
import { Status } from '../enum/status.enum'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const AuthRouter = express.Router()

AuthRouter.post('/sign', async (req: Request, res: Response) => {
	try {
		const user = await req.prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (user && await argon2.verify(user.password, req.body.password)) {
            const key = crypto.randomBytes(32).toString('hex')
            const token = jwt.sign({name: user.name, email: user.email}, '7efb9cbcec18c02436a75866c882f59877b34fb9436dc0bb65232ff8db01e8ef', {expiresIn: 86400});
            await req.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    token: token,
                }
            })
            const response = new HttpResponse(Code.OK, Status.OK, 'Autenticado com sucesso', {token: token, key: key})
            res.status(response.statusCode()).send(response)

        } else {

            const response = new HttpResponse(Code.UNAUTHORIZED, Status.UNAUTHORIZED, 'Email ou senha incorretos.')
            res.status(response.statusCode()).send(response)
        }
		
	} catch (error: any) {
		console.error(error)
		const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, error.message)
		res.status(response.statusCode()).send(response)
        
	} finally {
		await req.prisma.$disconnect()
		return
	}
});

AuthRouter.post('/checkToken', async (req: Request, res: Response) => {
	try {
        const token = (<string>req.headers.authorization).split(' ')[1]
        jwt.verify(token, '7efb9cbcec18c02436a75866c882f59877b34fb9436dc0bb65232ff8db01e8ef', (err, decoded) => {
            if(!err) {
                const response = new HttpResponse(Code.OK, Status.OK, 'Token válido')
                res.status(response.statusCode()).send(response)

            } else {
                const response = new HttpResponse(Code.UNAUTHORIZED, Status.UNAUTHORIZED, err.message)
                res.status(response.statusCode()).send(response)
            }
        })
	} catch (error: any) {
		console.error(error)
		const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, error.message)
		res.status(response.statusCode()).send(response)
	}
});

export default AuthRouter