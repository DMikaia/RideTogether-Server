import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  async updateDataArray<T extends { id: string }, U extends { id: string }>(
    key: string,
    value: U,
    ttl: number,
  ) {
    const data = await this.getCachedData<T[]>(key);

    if (data) {
      const updatedData = data.map((elt) =>
        elt.id === value.id ? { ...elt, ...value } : elt,
      );

      await this.setCachedData<T[]>(key, updatedData, ttl);
    }
  }

  async updateData<T>(key: string, value: T, ttl: number) {
    const data = await this.getCachedData<T>(key);

    if (data) {
      const newData = { ...data, ...value };

      await this.setCachedData<T>(key, newData, ttl);
    }
  }

  async pushNewData<T>(key: string, value: T, ttl: number) {
    const data = await this.getCachedData<T[]>(key);

    if (data) {
      data.push(value);
      await this.setCachedData<T[]>(key, data, ttl);
    }
  }

  async removeData(key: string) {
    await this.cacheManager.del(key);
  }

  async removeDataArray<T extends { id: string }>(
    key: string,
    value: T,
    ttl: number,
  ) {
    const data = await this.getCachedData<T[]>(key);

    if (data) {
      const updatedData = data.filter((element) => element.id !== value.id);

      if (updatedData.length === 0) {
        await this.cacheManager.del(key);
      } else {
        await this.setCachedData<T[]>(key, updatedData, ttl);
      }
    }
  }

  async getCachedData<T>(key: string): Promise<T | undefined> {
    const data = await this.cacheManager.get<T>(key);

    return data;
  }

  async setCachedData<T>(key: string, value: T, ttl: number) {
    await this.cacheManager.set(key, value, { ttl } as any);
  }
}
