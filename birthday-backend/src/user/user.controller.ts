import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users/register — 신규 가입 (회원가입)
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  // POST /users/login — 기존 계정 확인 (로그인)
  @Post('login')
  login(@Body() dto: CreateUserDto) {
    return this.userService.login(dto);
  }
}
