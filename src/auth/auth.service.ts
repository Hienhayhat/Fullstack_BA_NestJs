import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/util/helper';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
    const comparePassword = await comparePasswordHelper(pass, user.password)
    if (!comparePassword) {
      throw new UnauthorizedException('usernam/password khong hop le');
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}