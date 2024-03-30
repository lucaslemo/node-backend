import express, { type Application } from 'express'
import fs from 'fs'
import ip from 'ip'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { Code } from './enum/code.enum'
import { HttpResponse } from './domain/responses'
import { Status } from './enum/status.enum'

export class App {
  private readonly app: Application
  private readonly port: string | number
  private readonly APPLICATION_RUNNING = 'A aplicação está rodando em: '
  private readonly APPLICATION_NOT_RUNNING = 'A aplicação parada'
  private readonly ROUTE_NOT_FOUND = 'Rota não encontrada'

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
    this.app.get('/', (req, res) => {
      const response = new HttpResponse(Code.OK, Status.OK, 'Hello world! from docker, best than before!')
      res.status(response.statusCode()).send(response)
    })

    this.app.all('*', (req, res) => {
      const response = new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)
      res.status(response.statusCode()).send(response)
    })
  }
}
