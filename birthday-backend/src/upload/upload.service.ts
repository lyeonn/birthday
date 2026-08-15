import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private readonly s3 = new S3Client({ region: process.env.AWS_REGION });
  private readonly bucket = process.env.S3_BUCKET!;
  // 로컬/운영 산출물이 같은 버킷 안에서 섞이지 않도록 폴더로 분리
  private readonly env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

  // 이미지 버퍼를 S3에 업로드하고 공개 URL 반환
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const key = `birthday/${this.env}/${randomUUID()}${extname(file.originalname)}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
