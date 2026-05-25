import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

export interface AuthedUser {
  id: number;
  nickname: string;
  token: string;
}

// Authorization: Bearer <token> 헤더에서 토큰을 꺼내 User로 변환 후 request.user에 부착
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthedUser }>();
    const header = req.headers['authorization'] ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('인증 토큰이 없어요');
    }

    const user = await this.prisma.user.findUnique({
      where: { token },
      select: { id: true, nickname: true, token: true },
    });
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰이에요');
    }

    req.user = user;
    return true;
  }
}