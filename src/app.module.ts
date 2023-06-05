import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    UsersModule, EmailModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_ID,
      password: process.env.MYSQL_PW,
      database: process.env.MYSQL_DB,
      port: parseInt(String(process.env.MYSQL_PORT)),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // [INFO] activate when applying middleware to a particular router
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes('/users')
  }
}
