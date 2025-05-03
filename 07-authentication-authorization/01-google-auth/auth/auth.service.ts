import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async login(user: User) {
    const token = await this.generateAccessToken(user);

    const existingUser = await this.usersService.findOne(user.id);

    if (!existingUser) {
      await this.usersService.create(user);
    }

    return { token: token };
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.displayName,
      avatar: user.avatar,
    });
  }
}
