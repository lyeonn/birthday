import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PageModule } from './page/page.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, PageModule, UserModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
