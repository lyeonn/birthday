import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard, AuthedUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

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

  // PATCH /pages/:code/messages/:id — 메시지 수정 (작성자만)
  @UseGuards(AuthGuard)
  @Patch('messages/:id')
  update(
    @Param('code') code: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMessageDto,
    @CurrentUser() user: AuthedUser,
  ) {
    return this.messageService.update(code, id, dto, user.id);
  }

  // DELETE /pages/:code/messages/:id — 메시지 삭제 (작성자 OR 호스트)
  @UseGuards(AuthGuard)
  @Delete('messages/:id')
  remove(
    @Param('code') code: string,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthedUser,
  ) {
    return this.messageService.remove(code, id, user.id);
  }
}