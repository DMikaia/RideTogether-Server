import { Controller, HttpStatus, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { ErrorService } from 'src/error/error.service';
import { UserService } from 'src/user/user.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { roomContract } from './room-contract';
import { ReqWithUser } from 'src/auth/request/req-user';

@Controller()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly errorService: ErrorService,
    private readonly userService: UserService,
  ) {}

  @TsRestHandler(roomContract.getRoomList)
  async getRoomList(@Req() req: ReqWithUser) {
    return tsRestHandler(roomContract.getRoomList, async () => {
      try {
        const id = await this.userService.getUserId(req.user.email);
        const offer = await this.roomService.getRoomList(id);

        if (offer) {
          return {
            status: HttpStatus.OK,
            body: offer,
          };
        }
      } catch (error) {
        await this.errorService.handleApiError(error, 'room');
      }
    });
  }
}
