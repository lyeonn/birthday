import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('pages/:code')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // GET /pages/:code/messages — 기본 최신 3개, ?all=true면 전체
  @Get('messages')
  list(@Param('code') code: string, @Query('all') all?: string) {
    return this.messageService.listByPageCode(code, all === 'true');
  }

  // POST /pages/:code/messages — 축하글 작성 (글 + 사진 1장)
  @Post('messages')
  create(@Param('code') code: string, @Body() dto: CreateMessageDto) {
    return this.messageService.create(code, dto);
  }
}
