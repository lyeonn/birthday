import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePhotoCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  content!: string;
}
