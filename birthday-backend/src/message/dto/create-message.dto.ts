import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  // 작성자 user id (클라가 localStorage에서 꺼내서 보냄)
  // TODO: 토큰 미들웨어 붙이면 헤더에서 자동 추출로 교체
  @IsInt()
  authorId!: number;

  // 축하 메시지 본문
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content!: string;

  // 메시지에 첨부할 사진 1장 (먼저 /upload로 받은 URL)
  @IsOptional()
  @IsString()
  photoUrl?: string;

  // 카드 색 (사용자가 골랐을 때만. NULL이면 프론트에서 자동 배정)
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'cardColor must be #RRGGBB hex' })
  cardColor?: string;
}
