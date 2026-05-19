import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePageDto {
  // 페이지를 만드는 본인(호스트)의 user id.
  // TODO: User 모듈 붙으면 Authorization 토큰에서 추출. 일단 바디로 받음.
  @IsInt()
  hostId!: number;

  // 생일 주인공(친구)의 이름. 페이지 곳곳에 표시됨.
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  friendName!: string;

  // 친구의 생년월일 (YYYY-MM-DD)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birthday must be YYYY-MM-DD' })
  birthday!: string;

  // 메인에 크게 보일 축하 문구
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  greeting!: string;

  // 페이지 대표 색상 (#RRGGBB)
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be #RRGGBB hex' })
  color!: string;

  // 친구 대표 사진 (선택)
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
