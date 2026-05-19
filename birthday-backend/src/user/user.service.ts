import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // 신규 가입 — 같은 (nickname, pin)이 이미 있으면 409
  async register(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: { nickname: dto.nickname, pin: dto.pin },
      });
    } catch (err: unknown) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          '이미 사용 중인 닉네임+PIN 조합이에요. 다른 PIN을 써주세요.',
        );
      }
      throw err;
    }
  }

  // 로그인 — (nickname, pin)으로 lookup. 없으면 404
  async login(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { nickname_pin: { nickname: dto.nickname, pin: dto.pin } },
    });
    if (!user) {
      throw new NotFoundException(
        '해당 닉네임+PIN으로 가입된 계정이 없어요.',
      );
    }
    return user;
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
