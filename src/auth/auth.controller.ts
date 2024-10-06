import { Controller, Get, Post, HttpCode, HttpStatus, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorator/customize';
import { RegisterDto } from './dto/RegisterDto-auth.dto';
import { register } from 'module';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Public()
  @Post('register')
  Register(@Body() registerDto: RegisterDto) {

    return this.authService.register(registerDto)
  }
}
