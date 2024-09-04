import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/lib/constants/common.constants';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  // check if an admin user exists in the database and create one if not
  async onModuleInit() {
    const admin = await this.databaseService.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!admin) {
      const password = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin',
        SALT_OR_ROUNDS,
      );

      await this.databaseService.user.create({
        data: {
          username: process.env.ADMIN_USERNAME || 'admin',
          password,
          role: 'ADMIN',
        },
      });
    }
  }

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.databaseService.user.findUnique({
      where: { username },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!findUser) return null;

    const match = await bcrypt.compare(password, findUser.password);

    if (match) {
      const { password, ...user } = findUser;
      return {
        user: { id: user.id, username: user.username, role: user.role },
        token: this.jwtService.sign(user),
      };
    }
  }
}
