import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt.helper';
import { JwtPayloadInterface } from 'src/types/common';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadInterface;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.split(' ')[1]; // Bearer <token>
      const decoded = verifyToken(token);

      req.user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
