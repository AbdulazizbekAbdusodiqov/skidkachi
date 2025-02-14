import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { MailModule } from "../mail/mail.module";
import { BotModule } from "src/bot/bot.module";
import { SmsModule } from "src/sms/sms.module";

@Module({
  imports: [SequelizeModule.forFeature([User]), MailModule, BotModule, SmsModule, ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
