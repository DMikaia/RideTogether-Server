import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

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

  async updateUser(email: string, image: string): Promise<void> {
    const user = await this.prismaService.client.user.update({
      data: {
        image,
      },
      where: { email },
      select: {
        image: true,
      },
    });

    const data = await this.redisService.getCachedData<UserDto>(
      `user:${email}`,
    );

    if (data) {
      await this.redisService.setCachedData<UserDto>(
        `user:${email}`,
        { image: user.image, ...data },
        1500,
      );
    }
  }

  async removeUser(email: string) {
    await this.redisService.removeData(`user:${email}`);
  }

  async getUserId(email: string) {
    const user = await this.prismaService.client.user.findFirst({
      where: { email },
      select: {
        id: true,
      },
    });

    return user.id;
  }

  async getUserById(id: string): Promise<UserDto | undefined> {
    const user = await this.prismaService.client.user.findFirst({
      where: { id },
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

  async getUser(email: string): Promise<UserDto | undefined> {
    const data = await this.redisService.getCachedData<UserDto>(
      `user:${email}`,
    );

    if (data) {
      return data;
    }

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
      await this.redisService.setCachedData<UserDto>(
        `user:${email}`,
        user,
        1500,
      );

      return user;
    }

    return null;
  }
}
