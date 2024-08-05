import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { OfferModule } from './offer/offer.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './redis/redis.resolver';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.registerAsync(RedisOptions),
    PrismaModule,
    FirebaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    OfferModule,
    ChatModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
