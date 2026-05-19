import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

// 업로드된 파일을 birthday-backend/uploads/에 저장
const storage = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

@Controller('upload')
export class UploadController {
  // POST /upload — multipart/form-data, field name "file"
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        // 이미지만 허용
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('이미지 파일만 업로드할 수 있어요'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('파일이 없어요');
    // 프론트에서 사용할 절대 URL 반환
    const url = `http://localhost:3001/uploads/${file.filename}`;
    return { url };
  }
}
