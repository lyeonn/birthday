import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Controller('pages/:code')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // GET /pages/:code/photos — 기본 최신 4개, ?all=true면 전체
  @Get('photos')
  list(@Param('code') code: string, @Query('all') all?: string) {
    return this.photoService.listByPageCode(code, all === 'true');
  }

  // POST /pages/:code/photos — 갤러리에 사진 등록 (호스트/친구 누구나)
  @Post('photos')
  create(@Param('code') code: string, @Body() dto: CreatePhotoDto) {
    return this.photoService.create(code, dto);
  }
}
