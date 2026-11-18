import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DocumentModule } from './document/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import openAiConfig from './config/openai.config';
import securityConfig from './config/security.config';
import { ApiKeyGuard } from './shared/guards/api-key.guard';

@Module({
  imports: [
    DocumentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, openAiConfig, securityConfig],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 20,
      },
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('database');

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
