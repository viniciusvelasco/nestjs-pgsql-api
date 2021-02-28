import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './configs/winston.config';
import { LoggerMiddleware } from './interceptors/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
