import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  // 호스트 본인 닉네임
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  nickname!: string;

  // 4자리 숫자 PIN
  @Matches(/^\d{4}$/, { message: 'pin must be 4 digits' })
  pin!: string;
}
