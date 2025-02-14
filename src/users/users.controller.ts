import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserGuard } from "../guards/user.guard";
import { UserSelfGuard } from "../guards/user-self.guard";
import { FindUserDto } from "./dto/find-user.dto";
import { AdminGuard } from "../guards/admin.guard";
import { PhoneUserDto } from "./dto/phone-user.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("sms")
  async getSmsToken() {
    return this.usersService.getSmsTokens();
  }

  @HttpCode(200)
  @Post("newotp")
  newOtp(@Body() phoneUserDto: PhoneUserDto) {
    return this.usersService.newOtp(phoneUserDto);
  }
  @HttpCode(200)
  @Post("verifyotp")
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyOtpDto);
  }

  @Get("activate/:link")
  activated(@Param("link") link: string) {
    console.log("hello");

    return this.usersService.activate(link);
  }

  // @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(AdminGuard)
  @HttpCode(200)
  @Post("find-user")
  find(@Body() findUserDto: FindUserDto) {
    return this.usersService.findUser(findUserDto);
  }

  // @UseGuards(UserSelfGuard)
  // @UseGuards(UserGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  // @UseGuards(UserSelfGuard)
  // @UseGuards(UserGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  // @UseGuards(AdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @Patch("sms/refresh")
  async refreshTokenSms() {
    return this.usersService.refreshTokenSms();
  }
}
