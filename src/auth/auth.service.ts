import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/util/helper';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/RegisterDto-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user: any = await this.usersService.SignWithEmail(username);
    if (!user) {
      return null;
    }
    const comparePassword = await comparePasswordHelper(pass, user.password)
    if (!comparePassword) {
      return null;
    } else {
      return user;
    }
  };

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerDto: RegisterDto) {
    return this.usersService.registerUser(registerDto);
  }
}