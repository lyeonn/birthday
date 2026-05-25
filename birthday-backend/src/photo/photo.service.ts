import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

// 메인 화면 미리보기 갯수
const PHOTOS_LIMIT = 4;

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaService) {}

  // 갤러리 사진 목록 — 기본 최신 4개, all=true면 전부
  async listByPageCode(code: string, all = false) {
    const page = await this.prisma.page.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!page) throw new NotFoundException(`Page not found: ${code}`);

    const rows = await this.prisma.photo.findMany({
      where: { pageId: page.id },
      select: {
        id: true,
        url: true,
        createdAt: true,
        uploaderId: true,
        uploader: { select: { nickname: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: all ? undefined : PHOTOS_LIMIT,
    });
    return rows.map(({ uploader, ...rest }) => ({
      ...rest,
      uploaderNickname: uploader.nickname,
    }));
  }

  // 갤러리에 새 사진 등록
  async create(code: string, dto: CreatePhotoDto) {
    const page = await this.prisma.page.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!page) throw new NotFoundException(`Page not found: ${code}`);

    try {
      const photo = await this.prisma.photo.create({
        data: {
          pageId: page.id,
          uploaderId: dto.uploaderId,
          url: dto.url,
        },
        select: {
          id: true,
          url: true,
          createdAt: true,
          uploader: { select: { nickname: true } },
        },
      });
      const { uploader, ...rest } = photo;
      return { ...rest, uploaderNickname: uploader.nickname };
    } catch (err: unknown) {
      // uploaderId가 존재하지 않는 user면 FK 위반(P2003)
      if (this.isFkViolation(err)) {
        throw new BadRequestException('존재하지 않는 업로더예요');
      }
      throw err;
    }
  }

  // 사진 한 장 조회 (상세 페이지용)
  async findOne(code: string, id: number) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
      select: {
        id: true,
        url: true,
        createdAt: true,
        uploaderId: true,
        uploader: { select: { nickname: true } },
        page: { select: { code: true } },
      },
    });
    if (!photo || photo.page.code !== code) {
      throw new NotFoundException('사진을 찾을 수 없어요');
    }
    const { uploader, page: _page, ...rest } = photo;
    void _page;
    return { ...rest, uploaderNickname: uploader.nickname };
  }

  // 사진 삭제 — 업로더 또는 호스트
  async remove(code: string, id: number, userId: number) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
      select: {
        id: true,
        uploaderId: true,
        page: { select: { code: true, hostId: true } },
      },
    });
    if (!photo || photo.page.code !== code) {
      throw new NotFoundException('사진을 찾을 수 없어요');
    }
    const isUploader = photo.uploaderId === userId;
    const isHost = photo.page.hostId === userId;
    if (!isUploader && !isHost) {
      throw new ForbiddenException('삭제 권한이 없어요');
    }
    await this.prisma.photo.delete({ where: { id } });
    return { ok: true };
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
