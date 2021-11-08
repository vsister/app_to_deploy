import express from 'express';
import { ExceptionHandler } from 'utils/exceptionHandler/ExceptionHandler';

export function exceptionHandler(
  err: any,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (err) {
    const errorResponse = new ExceptionHandler(err).getResponse();
    errorResponse.send(res);
  } else {
    next();
  }
}
