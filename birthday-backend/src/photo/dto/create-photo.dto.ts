import { IsInt, IsString, MinLength } from 'class-validator';

export class CreatePhotoDto {
  // 업로더 user id (호스트든 친구든 누구나 가능)
  // TODO: 토큰 미들웨어 붙으면 헤더에서 자동 추출로 교체
  @IsInt()
  uploaderId!: number;

  // 미리 /upload로 받은 사진 URL
  @IsString()
  @MinLength(1)
  url!: string;
}
