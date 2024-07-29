import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}
