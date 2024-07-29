import { UserDto } from 'src/user/dto/user.dto';

export class AuthDto {
  user: UserDto;
  expiration: number;
  cookie: string;
}
