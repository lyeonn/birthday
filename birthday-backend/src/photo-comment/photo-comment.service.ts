import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoCommentDto } from './dto/create-photo-comment.dto';
import { UpdatePhotoCommentDto } from './dto/update-photo-comment.dto';

@Injectable()
export class PhotoCommentService {
  constructor(private readonly prisma: PrismaService) {}

  // 댓글 목록 — 오래된 순 (대화 흐름 자연스럽게)
  async listByPhoto(code: string, photoId: number) {
    await this.ensurePhotoInPage(code, photoId);

    const rows = await this.prisma.photoComment.findMany({
      where: { photoId, deletedAt: null },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
        author: { select: { nickname: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(({ author, ...rest }) => ({
      ...rest,
      authorNickname: author.nickname,
    }));
  }

  // 댓글 작성
  async create(
    code: string,
    photoId: number,
    dto: CreatePhotoCommentDto,
    userId: number,
  ) {
    await this.ensurePhotoInPage(code, photoId);
    const created = await this.prisma.photoComment.create({
      data: { photoId, authorId: userId, content: dto.content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
        author: { select: { nickname: true } },
      },
    });
    const { author, ...rest } = created;
    return { ...rest, authorNickname: author.nickname };
  }

  // 댓글 수정 — 작성자만
  async update(
    code: string,
    photoId: number,
    commentId: number,
    dto: UpdatePhotoCommentDto,
    userId: number,
  ) {
    const comment = await this.findComment(code, photoId, commentId);
    if (comment.authorId !== userId) {
      throw new ForbiddenException('본인 댓글만 수정할 수 있어요');
    }
    const updated = await this.prisma.photoComment.update({
      where: { id: commentId },
      data: { content: dto.content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
        author: { select: { nickname: true } },
      },
    });
    const { author, ...rest } = updated;
    return { ...rest, authorNickname: author.nickname };
  }

  // 댓글 삭제 — 작성자 OR 호스트 (soft delete)
  async remove(
    code: string,
    photoId: number,
    commentId: number,
    userId: number,
  ) {
    const comment = await this.findComment(code, photoId, commentId);
    const isAuthor = comment.authorId === userId;
    const isHost = comment.photo.page.hostId === userId;
    if (!isAuthor && !isHost) {
      throw new ForbiddenException('삭제 권한이 없어요');
    }
    await this.prisma.photoComment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  }

  // photo가 해당 page에 속하는지 확인
  private async ensurePhotoInPage(code: string, photoId: number) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true, page: { select: { code: true } } },
    });
    if (!photo || photo.page.code !== code) {
      throw new NotFoundException('사진을 찾을 수 없어요');
    }
    return photo;
  }

  // 권한 체크용: 댓글 + 사진 + 페이지 host 조회
  private async findComment(code: string, photoId: number, commentId: number) {
    const comment = await this.prisma.photoComment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        deletedAt: true,
        photoId: true,
        photo: {
          select: { id: true, page: { select: { code: true, hostId: true } } },
        },
      },
    });
    if (
      !comment ||
      comment.deletedAt ||
      comment.photoId !== photoId ||
      comment.photo.page.code !== code
    ) {
      throw new NotFoundException('댓글을 찾을 수 없어요');
    }
    return comment;
  }
}