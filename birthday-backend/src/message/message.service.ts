import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

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
