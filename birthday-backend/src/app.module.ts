import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PageModule } from './page/page.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { MessageModule } from './message/message.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [PrismaModule, PageModule, UserModule, UploadModule, MessageModule, PhotoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
