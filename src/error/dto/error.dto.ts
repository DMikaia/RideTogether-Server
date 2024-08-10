import { HttpStatus } from '@nestjs/common';

export type ApiError = {
  status: HttpStatus;
  body: {
    message: string;
  };
};
