import { type Code } from '../enum/code.enum'
import { type Status } from '../enum/status.enum'

export class HttpResponse {
  private readonly timeStamp: string
  private readonly code: Code
  private readonly status: Status
  private readonly message: string
  private readonly data?: Record<string, unknown>

  constructor (code: Code, status: Status, message: string, data?: Record<string, unknown>) {
    this.timeStamp = new Date().toLocaleString()
    this.code = code
    this.status = status
    this.message = message
    this.data = data
  }

  statusCode (): Code {
    return this.code
  }

  httpStatus (): Status {
    return this.status
  }
}
