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
import { ErrorModule } from './error/error.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.registerAsync(RedisOptions),
    ErrorModule,
    PrismaModule,
    FirebaseModule,
    RedisModule,
    UserModule,
    AuthModule,
    OfferModule,
    ReviewsModule,
    RoomModule,
    ChatModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
