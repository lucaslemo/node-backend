import express, { type Request, type Application, type Response } from 'express'
import fs from 'fs'
import ip from 'ip'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { Code } from './enum/code.enum'
import { HttpResponse } from './domain/responses'
import { Status } from './enum/status.enum'
import { PrismaClient } from '@prisma/client'

export class App {
  private readonly app: Application
  private readonly port: string | number
  private readonly APPLICATION_RUNNING: string = 'A aplicação está rodando em: '
  private readonly APPLICATION_NOT_RUNNING: string = 'A aplicação parada'
  private readonly ROUTE_NOT_FOUND: string = 'Rota não encontrada'

  constructor () {
    dotenv.config()
    this.port = process.env.APP_PORT ?? 3000
    this.app = express()
    this.middleware()
    this.routes()
  }

  listen (): void {
    const server = this.app.listen(this.port)
    console.info(this.APPLICATION_RUNNING + ip.address() + ':' + this.port)
    process.on('SIGINT', () => {
      server.close()
      console.info(this.APPLICATION_NOT_RUNNING)
    })
  }

  private middleware (): void {
    this.app.use(cors({ origin: '*' }))
    this.app.use(express.json())
    this.app.use(morgan('combined', {
      stream: fs.createWriteStream('./src/store/access.log', { flags: 'a' })
    }))
  }

  private routes (): void {
    this.app.get('/', (req: Request, res: Response) => {
      const response = new HttpResponse(Code.OK, Status.OK, 'Hello world! from docker, best than before!')
      res.status(response.statusCode()).send(response)
    })

    this.app.get('/users', async (req: Request, res: Response) => {
      const prisma = new PrismaClient()
      prisma.user.findMany()
        .then(async (users) => {
          await prisma.$disconnect()
          const response = new HttpResponse(Code.OK, Status.OK, 'Lista dos usuários', {users: users})
          res.status(response.statusCode()).send(response)
        })
        .catch(async (e) => {
          console.error(e)
          await prisma.$disconnect()
          const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, e.message)
          res.status(response.statusCode()).send(response)
        })
    })

    this.app.post('/users', async (req: Request, res: Response) => {
      const prisma = new PrismaClient()
      prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        },
      })
        .then(async (user) => {
          await prisma.$disconnect()
          const response = new HttpResponse(Code.CREATED, Status.CREATED, 'Usuário criado com sucesso!', {user: user})
          res.status(response.statusCode()).send(response)
        })
        .catch(async (e) => {
          console.error(e)
          await prisma.$disconnect()
          const response = new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, e.message)
          res.status(response.statusCode()).send(response)
        })
    })

    this.app.all('*', (req: Request, res: Response) => {
      const response = new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)
      res.status(response.statusCode()).send(response)
    })
  }
}
