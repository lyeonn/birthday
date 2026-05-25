import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// PrismaModule이 @Global이라 따로 import 안 해도 PrismaService 주입 가능.
// AuthGuard를 어디서나 @UseGuards(AuthGuard)로 쓸 수 있게 @Global로 export.
@Global()
@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}