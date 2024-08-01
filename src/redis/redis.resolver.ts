import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';

dotenv.config();

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });
    return {
      store: () => store,
    };
  },
};
