import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

export const loggerMiddleware = (
  req: Request, res: Response, next: NextFunction,
) => {
  const logComponents: (Record<string, string> | string)[] = [req.method, req.url];

  switch (req.method) {
    case 'POST':
    case 'PUT':
    case 'PATCH':
      logComponents.push(req.body as Record<string, string>);
      break;
    case 'GET':
    case 'DELETE':
      logComponents.push(req.query as Record<string, string>);
      break;
  }
  console.log(`${req.method} ${req.url} ${res.statusCode.toString()[0] === '2' ?
    '\x1b[32m'.concat(res.statusCode.toString(), '\x1b[37m') : ''
    }\n     Body/QS: `, logComponents[2]);
  next();
};