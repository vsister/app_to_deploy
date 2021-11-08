import express from 'express';

export function wrapAsync(fn: express.Handler) {
  return function (req: express.Request, res: express.Response, next: express.NextFunction): void {
    (fn(req, res, next) as any).catch(next);
  };
}
