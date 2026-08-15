import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

// FileInterceptor / FilesInterceptor 공통 옵션 (메모리 저장 + 5MB + 이미지만)
const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (err: Error | null, accept: boolean) => void,
  ) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new BadRequestException('이미지 파일만 업로드할 수 있어요'), false);
      return;
    }
    cb(null, true);
  },
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // POST /upload — multipart/form-data, field name "file" (단일)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('파일이 없어요');
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }

  // POST /upload/multiple — multipart/form-data, field name "files" (여러 장, 최대 20장)
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new BadRequestException('파일이 없어요');
    const urls = await Promise.all(
      files.map((file) => this.uploadService.uploadImage(file)),
    );
    return { urls };
  }
}
