import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthedUser } from './auth.guard';

// AuthGuard가 req.user에 부착해둔 사용자 정보를 컨트롤러 인자로 꺼내는 데코레이터
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthedUser => {
    const req = ctx.switchToHttp().getRequest<Request & { user: AuthedUser }>();
    return req.user;
  },
);