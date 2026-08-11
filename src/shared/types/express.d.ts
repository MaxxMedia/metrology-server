import "express"

declare global {
  namespace Express {
    interface UserPayload {
      id: number
      role: string
      email?: string
      companyId?: number | null
    }

    interface Request {
      user?: UserPayload
    }
  }
}

export {}
