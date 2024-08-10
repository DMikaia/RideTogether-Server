import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const config = {
      password: configService.get<string>('REDIS_PASSWORD'),
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT')),
      },
    };

    const store = await redisStore(config);

    return {
      store: () => store,
    };
  },
};
