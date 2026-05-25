import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { MessageModule } from './message/message.module';
import { PhotoModule } from './photo/photo.module';
import { PhotoCommentModule } from './photo-comment/photo-comment.module';

@Module({
  imports: [PrismaModule, AuthModule, PageModule, UserModule, UploadModule, MessageModule, PhotoModule, PhotoCommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
