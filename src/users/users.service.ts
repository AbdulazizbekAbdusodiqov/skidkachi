import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { MailService } from "../mail/mail.service";
import { FindUserDto } from "./dto/find-user.dto";
import { Op } from "sequelize";
import { BotService } from "src/bot/bot.service";
import otpGenerator from "otp-generator";
import { PhoneUserDto } from "./dto/phone-user.dto";
import { SmsService } from "src/sms/sms.service";
import path from "path";
import fs from "fs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService,
  ) {}

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
      email: user.email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("parollar mos emas");
    }
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);

    const activation_link = uuid.v4();

    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      activation_link,
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }

    return newUser;
  }

  async activate(link: string) {
    console.log("hello2");

    if (!link) {
      throw new BadRequestException("Activation link not found");
    }
    const updateUser = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    );

    if (!updateUser[1][0]) {
      throw new BadRequestException("User already activates");
    }
    const response = {
      message: "User activated successfully",
      user: updateUser[1][0].is_active,
    };

    return response;
  }
  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.update(updateUserDto, {
      where: { id },
      returning: true,
    });
    return user[1][0];
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updatedUser = await this.userModel.update(
      { hashed_refresh_token },
      {
        where: { id },
      }
    );

    return updatedUser;
  }
  remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }

  async refreshTokenSms() {
    return await this.smsService.refreshToken();
  }

  async getSmsTokens() {
    try {
      const response = await this.smsService.getToken();
      const newToken = response.data?.data?.token;
      if (!newToken) {
        throw new Error("Token not found in response");
      }
      this.updateEnvFile("SMS_TOKEN", newToken); // .env faylni yangilash
      process.env.SMS_TOKEN = newToken; // Yangi tokenni process.env ichida ham yangilash
      console.log("Token muvaffaqiyatli yangilandi.");
    } catch (error) {
      console.error("Failed to get SMS token:", error.message);
      throw new InternalServerErrorException("Failed to get SMS token");
    }
  }

  async findUser(findUserDto: FindUserDto) {
    const { name, email, phone } = findUserDto;
    const where = {};
    if (name) {
      where["name"] = {
        [Op.iLike]: `%${name}%`,
      };
    }
    if (email) {
      where["email"] = {
        [Op.iLike]: `%${email}%`,
      };
    }
    if (phone) {
      where["phone"] = {
        [Op.like]: `%${phone}%`,
      };
    }
    console.log(where);

    const users = await this.userModel.findAll({ where });
    if (!users) {
      throw new NotFoundException("User not found");
    }
    return users;
  }

  async newOtp(phoneUserDto: PhoneUserDto) {
    const { phone_number } = phoneUserDto;

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //--------------------------------------SMS--------------------------------

    const response = await this.smsService.sendSms(phone_number, otp);
    console.log(response);

    if (response.status !== 200) {
      throw new ServiceUnavailableException("OTP yuborishda xatolik");
    }

    const message =
      `OTP code has been send to ****` +
      phone_number.slice(phone_number.length - 4);

    //-------------------------------------------------------------------------

    const isSend = this.botService.sendOtp(phone_number, otp);
    if (!isSend) {
      throw new BadRequestException("Avval botdan ro'yxatdan o'ting");
    }
    return {
      message: "OTP botga yuborildi",
      smsMessage: message,
    };
  }
  private updateEnvFile(key: string, value: string) {
    try {
      const envFilePath = path.resolve(__dirname, "../../.env");
      const envFile = fs.readFileSync(envFilePath, "utf8");
      const envLines = envFile.split("\n");

      // Har bir qatordan `SMS_TOKEN` ni topamiz va o‘zgartiramiz
      const newEnvLines = envLines.map((line) => {
        if (line.startsWith(`${key}=`)) {
          return `${key}=${value}`;
        }
        return line;
      });

      fs.writeFileSync(envFilePath, newEnvLines.join("\n"));
      console.log(`.env fayl ichidagi ${key} muvaffaqiyatli yangilandi.`);
    } catch (error) {
      console.error(".env faylni yangilashda xatolik:", error.message);
    }
  }
}
