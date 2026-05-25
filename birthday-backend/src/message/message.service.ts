import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

// 메인 화면 미리보기 갯수
const MESSAGES_LIMIT = 3;

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  // 축하글 목록 — 기본 최신 3개, all=true면 전부
  async listByPageCode(code: string, all = false) {
    const page = await this.prisma.page.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!page) throw new NotFoundException(`Page not found: ${code}`);

    const rows = await this.prisma.message.findMany({
      where: { pageId: page.id, deletedAt: null },
      select: {
        id: true,
        content: true,
        photoUrl: true,
        cardColor: true,
        createdAt: true,
        authorId: true,
        author: { select: { nickname: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: all ? undefined : MESSAGES_LIMIT,
    });
    return rows.map(({ author, ...rest }) => ({
      ...rest,
      authorNickname: author.nickname,
    }));
  }

  // 새 축하글 작성
  async create(code: string, dto: CreateMessageDto) {
    const page = await this.prisma.page.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!page) throw new NotFoundException(`Page not found: ${code}`);

    try {
      const message = await this.prisma.message.create({
        data: {
          pageId: page.id,
          authorId: dto.authorId,
          content: dto.content,
          photoUrl: dto.photoUrl,
          cardColor: dto.cardColor,
        },
        select: {
          id: true,
          content: true,
          photoUrl: true,
          cardColor: true,
          createdAt: true,
          author: { select: { nickname: true } },
        },
      });
      const { author, ...rest } = message;
      return { ...rest, authorNickname: author.nickname };
    } catch (err: unknown) {
      // authorId가 존재하지 않는 user면 FK 위반(P2003)
      if (this.isFkViolation(err)) {
        throw new BadRequestException('존재하지 않는 작성자예요');
      }
      throw err;
    }
  }

  // 메시지 수정 — 작성자 본인만 가능
  async update(
    code: string,
    id: number,
    dto: UpdateMessageDto,
    userId: number,
  ) {
    const message = await this.findMessageInPage(code, id);
    if (message.authorId !== userId) {
      throw new ForbiddenException('본인이 쓴 글만 수정할 수 있어요');
    }

    const updated = await this.prisma.message.update({
      where: { id },
      data: {
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
      },
      select: {
        id: true,
        content: true,
        photoUrl: true,
        cardColor: true,
        createdAt: true,
        author: { select: { nickname: true } },
      },
    });
    const { author, ...rest } = updated;
    return { ...rest, authorNickname: author.nickname };
  }

  // 메시지 삭제 — 작성자 또는 호스트 (soft delete: deletedAt 세팅)
  async remove(code: string, id: number, userId: number) {
    const message = await this.findMessageInPage(code, id);
    const isAuthor = message.authorId === userId;
    const isHost = message.page.hostId === userId;
    if (!isAuthor && !isHost) {
      throw new ForbiddenException('삭제 권한이 없어요');
    }
    await this.prisma.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  }

  // 권한 체크용: 페이지 내 메시지를 page.hostId까지 같이 가져옴
  private async findMessageInPage(code: string, id: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        deletedAt: true,
        page: { select: { code: true, hostId: true } },
      },
    });
    if (!message || message.deletedAt || message.page.code !== code) {
      throw new NotFoundException('메시지를 찾을 수 없어요');
    }
    return message;
  }

  // Prisma FK 위반(P2003) 판별
  private isFkViolation(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2003'
    );
  }
}
