import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PhotoCommentService } from './photo-comment.service';
import { CreatePhotoCommentDto } from './dto/create-photo-comment.dto';
import { UpdatePhotoCommentDto } from './dto/update-photo-comment.dto';
import { AuthGuard, AuthedUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('pages/:code/photos/:photoId/comments')
export class PhotoCommentController {
  constructor(private readonly service: PhotoCommentService) {}

  // 조회는 누구나
  @Get()
  list(
    @Param('code') code: string,
    @Param('photoId', ParseIntPipe) photoId: number,
  ) {
    return this.service.listByPhoto(code, photoId);
  }

  // 작성 — 인증 필수
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Param('code') code: string,
    @Param('photoId', ParseIntPipe) photoId: number,
    @Body() dto: CreatePhotoCommentDto,
    @CurrentUser() user: AuthedUser,
  ) {
    return this.service.create(code, photoId, dto, user.id);
  }

  // 수정 — 작성자만
  @UseGuards(AuthGuard)
  @Patch(':commentId')
  update(
    @Param('code') code: string,
    @Param('photoId', ParseIntPipe) photoId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdatePhotoCommentDto,
    @CurrentUser() user: AuthedUser,
  ) {
    return this.service.update(code, photoId, commentId, dto, user.id);
  }

  // 삭제 — 작성자 OR 호스트
  @UseGuards(AuthGuard)
  @Delete(':commentId')
  remove(
    @Param('code') code: string,
    @Param('photoId', ParseIntPipe) photoId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: AuthedUser,
  ) {
    return this.service.remove(code, photoId, commentId, user.id);
  }
}