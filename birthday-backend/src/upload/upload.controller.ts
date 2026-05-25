import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// CLOUDINARY_URL 환경변수 자동 인식 (cloudinary://API_KEY:API_SECRET@CLOUD_NAME 형식)
cloudinary.config({ secure: true });

@Controller('upload')
export class UploadController {
  // POST /upload — multipart/form-data, field name "file"
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('이미지 파일만 업로드할 수 있어요'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('파일이 없어요');

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'birthday', resource_type: 'image' },
        (err, res) => {
          if (err || !res) return reject(err ?? new Error('업로드 실패'));
          resolve(res);
        },
      );
      stream.end(file.buffer);
    });

    return { url: result.secure_url };
  }
}
