import express, { type Request, type Application, type Response, type NextFunction } from 'express'
import fs from 'fs'
import ip from 'ip'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import session from 'express-session'
import UserRouter from './routes/userRoutes'
import AuthRouter from './routes/authRoutes'
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
    this.port = process.env.APP_PORT ?? 3030
    this.app = express()
    this.app.set('trust proxy', 1)
    this.middlewares()
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

  private middlewares (): void {
    this.app.use(helmet())
    this.app.use( session({
      secret : 's3Cur3',
      name : 'sessionId',
     })
   );
    this.app.use(cors({ origin: '*' }))
    this.app.use(express.json())
    this.app.use(morgan('combined', {
      stream: fs.createWriteStream('./src/store/access.log', { flags: 'a' })
    }))
    this.app.use(async (req: Request, res: Response, next: NextFunction) => {
      const prisma = new PrismaClient()
      req.prisma = prisma;
      next()
    })
  }

  private routes (): void {
    this.app.get('/', async (req: Request, res: Response) => {
      const response = new HttpResponse(Code.OK, Status.OK, 'Hello world! from docker, best than before!')
      res.status(response.statusCode()).send(response)
      await req.prisma.$disconnect()
    })

    this.app.use('/users', UserRouter)
    this.app.use('/auth', AuthRouter)
    
    this.app.all('*', async (req: Request, res: Response) => {
      const response = new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)
      res.status(response.statusCode()).send(response)
      await req.prisma.$disconnect()
    })
  }
}
