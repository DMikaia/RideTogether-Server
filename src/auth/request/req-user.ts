import { Request } from 'express';

export type ReqWithUser = Request & {
  user: {
    uid: string;
    email: string;
  };
  token: string;
};
