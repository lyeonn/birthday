import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    // 로컬 postgres는 SSL 없이, Render 같은 매니지드 DB는 SSL 필수
    const isLocal = connectionString?.includes('localhost') ?? false;
    super({
      adapter: new PrismaPg({
        connectionString,
        ssl: isLocal ? false : { rejectUnauthorized: false },
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
