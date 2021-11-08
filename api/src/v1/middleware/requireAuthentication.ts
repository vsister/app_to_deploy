import jwt from 'jsonwebtoken';
import express from 'express';
import { MissingTokenException } from 'utils/exception/Auth/MissingTokenException';
import { BadSecretException } from 'utils/exception/Auth/BadSecretException';
import { BadTokenException } from 'utils/exception/Auth/BadTokenException';

const { JWT_SECRET } = process.env;

export function requireAuthentication(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    throw new MissingTokenException();
  }

  if (!JWT_SECRET) {
    throw new BadSecretException();
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      throw new BadTokenException();
    } else {
      res.locals.username = (payload as { username: string }).username;
      res.locals.isAuthenticated = true;
      next();
    }
  });
}
