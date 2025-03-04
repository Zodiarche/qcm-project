import { Request } from 'express';
import { UserData } from '../middlewares/authMiddleware';

declare global {
  namespace Express {
    interface Request {
      userData?: UserData;
      headers: {
        authorization?: string;
        [key: string]: string | undefined;
      };
    }
  }
}
