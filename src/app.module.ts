import { Module } from '@nestjs/common';
import { DocumentModule } from './document/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    DocumentModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jorge',
      password: '32628088',
      database: 'ai_clause_db',
      autoLoadEntities: true,
      synchronize: false, // ⚠️ sempre false em projetos sérios
    }),
  ],
})
export class AppModule {}
