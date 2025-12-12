import { Request, Response, NextFunction } from 'express'

export function rawWebhook(req: Request, res: Response, next: NextFunction) {
  ;(req as any).rawBody = Buffer.from([], 'utf8')
  req.on('data', (chunk) => { (req as any).rawBody = Buffer.concat([ (req as any).rawBody, chunk ]) })
  req.on('end', () => next())
}

