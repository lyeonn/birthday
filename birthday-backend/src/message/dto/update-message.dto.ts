import { IsOptional, IsString, MaxLength, MinLength, IsUrl } from 'class-validator';

// 메시지 수정 — content와 photoUrl 변경 허용 (작성자만)
export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string | null;
}