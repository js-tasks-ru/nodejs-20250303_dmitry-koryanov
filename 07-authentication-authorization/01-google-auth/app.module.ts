import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";

import jwtConfig from "./config/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
