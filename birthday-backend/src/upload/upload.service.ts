import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    // CLOUDINARY_URL 환경변수 자동 인식 (cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
    cloudinary.config({ secure: true });
  }

  // 이미지 버퍼를 Cloudinary로 업로드하고 secure_url 반환
  async uploadImage(file: Express.Multer.File): Promise<string> {
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
    return result.secure_url;
  }
}
