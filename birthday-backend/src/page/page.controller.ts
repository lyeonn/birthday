import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  // POST /pages — 페이지 생성
  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pageService.create(dto);
  }

  // GET /pages?hostId=X — 해당 호스트가 만든 페이지 목록
  @Get()
  findByHost(@Query('hostId', ParseIntPipe) hostId: number) {
    return this.pageService.findByHost(hostId);
  }

  // GET /pages/:code — 공유 코드로 페이지 조회
  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.pageService.findByCode(code);
  }
}
