import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';

// 입장 코드 알파벳 — 0/O/1/I 제외해서 32자
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;
const MAX_CODE_RETRIES = 5;

@Injectable()
export class PageService {
  constructor(private readonly prisma: PrismaService) {}

  // 페이지 생성 + 유니크 코드 자동 발급
  async create(dto: CreatePageDto) {
    for (let i = 0; i < MAX_CODE_RETRIES; i++) {
      const code = this.generateCode();
      try {
        return await this.prisma.page.create({
          data: {
            code,
            hostId: dto.hostId,
            friendName: dto.friendName,
            birthday: new Date(dto.birthday), // "YYYY-MM-DD" → Date
            greeting: dto.greeting,
            color: dto.color,
            photoUrl: dto.photoUrl,
          },
        });
      } catch (err: unknown) {
        if (this.isUniqueViolation(err)) continue; // 코드 중복 → 다시 뽑기
        throw err;
      }
    }
    throw new InternalServerErrorException(
      'Failed to allocate a unique invite code',
    );
  }

  // 특정 호스트가 만든 페이지 목록 (최신순)
  async findByHost(hostId: number) {
    return this.prisma.page.findMany({
      where: { hostId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 공유 코드로 페이지 조회 — 메인 화면에 필요한 정보 한 번에 반환
  async findByCode(code: string) {
    const page = await this.prisma.page.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        friendName: true,
        birthday: true,
        greeting: true,
        color: true,
        photoUrl: true,
        createdAt: true,
        host: { select: { nickname: true } }, // MADE BY 카드용
      },
    });
    if (!page) throw new NotFoundException(`Page not found: ${code}`);
    // host.nickname을 평탄화해서 hostNickname으로 노출
    const { host, ...rest } = page;
    return { ...rest, hostNickname: host.nickname };
  }

  // 랜덤 6자 코드 생성
  private generateCode(): string {
    let s = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return s;
  }

  // Prisma unique 제약 위반(P2002) 판별
  private isUniqueViolation(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    );
  }
}
