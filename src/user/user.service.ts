import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkIfUserExists(username: string): Promise<boolean> {
    const user = await this.prismaService.client.user.findFirst({
      where: { username },
      select: { username: true },
    });

    return user ? true : false;
  }

  async createUser(user: Prisma.UserCreateInput): Promise<void> {
    await this.prismaService.client.user.create({ data: user });
  }

  async updateUser(
    email: string,
    information: Prisma.UserUpdateInput,
  ): Promise<void> {
    await this.prismaService.client.user.update({
      data: information,
      where: { email },
    });
  }

  async getUser(email: string): Promise<UserDto | undefined> {
    const user = await this.prismaService.client.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        email: true,
      },
    });

    if (user) {
      return user;
    }

    return null;
  }
}
