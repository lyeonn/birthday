import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { AuthGuard, AuthedUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('pages/:code')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // GET /pages/:code/photos — 기본 최신 4개, ?all=true면 전체
  @Get('photos')
  list(@Param('code') code: string, @Query('all') all?: string) {
    return this.photoService.listByPageCode(code, all === 'true');
  }

  // GET /pages/:code/photos/:id — 사진 한 장 (상세 페이지용)
  @Get('photos/:id')
  findOne(
    @Param('code') code: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.photoService.findOne(code, id);
  }

  // POST /pages/:code/photos — 갤러리에 사진 등록 (호스트/친구 누구나)
  @Post('photos')
  create(@Param('code') code: string, @Body() dto: CreatePhotoDto) {
    return this.photoService.create(code, dto);
  }

  // DELETE /pages/:code/photos/:id — 갤러리 사진 삭제 (업로더 OR 호스트)
  @UseGuards(AuthGuard)
  @Delete('photos/:id')
  remove(
    @Param('code') code: string,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthedUser,
  ) {
    return this.photoService.remove(code, id, user.id);
  }
}