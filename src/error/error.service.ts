import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TsRestException } from '@ts-rest/nest';
import { ApiError } from './dto/error.dto';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  async handleApiError(error: unknown, endpoint: string): Promise<ApiError> {
    if (error instanceof TsRestException) throw error;
    this.logger.error(`Error at /${endpoint}: ${error}`);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        message: 'Internal server error',
      },
    };
  }
}
