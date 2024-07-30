import { Request } from 'express';

export interface ReqWithUser extends Request {
  user?: {
    uid: string;
    email: string;
  };
  token?: string;
}
