import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { SocialLinkModule } from './social_link/social_link.module';
import { DiscountTypeModule } from './discount_type/discount_type.module';
import { District } from './district/models/district.model';
import { DistrictModule } from './district/district.module';
import { RegionModule } from './region/region.module';
import { Admin } from './admin/models/admin.model';
import { DiscountType } from './discount_type/models/discount_type.model';
import { Region } from './region/model/region.model';
import { SocialLink } from './social_link/models/social_link.model';
import { User } from './users/models/user.model';
import { CategoryModule } from './category/category.module';
import { Category } from './category/models/category.model';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BOT_NAME } from './app.constants';
import { StoreSocialLinkModule } from './store-social_link/store-social_link.module';
import { StoreSocialLink } from './store-social_link/models/store-social_link.model';
import { StoreModule } from './store/store.module';
import { Store } from './store/models/store.model';
import { StoreSubscribeModule } from './store_subscribe/store_subscribe.module';
import { StoreSubscribe } from './store_subscribe/models/store_subscribe.model';
import { Bot } from './bot/models/bot.model';
import { DiscountModule } from './discount/discount.module';
import { Discount } from './discount/models/discount.model';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/models/review.model';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/models/favorite.model';
import { Address } from './bot/models/address.model';
import { Car } from './bot/models/car.model';
import { SmsModule } from './sms/sms.module';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/models/otp.model';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName:  BOT_NAME,
      useFactory:()=>({
        token: process.env.BOT_TOKEN||"your_token",
        middlewares:[],
        include:[BotModule]
      })
    }),
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Admin,
        District,
        DiscountType,
        Region,
        SocialLink,
        User,
        Category,
        StoreSocialLink,
        Store,
        StoreSubscribe,
        Bot,
        Discount,
        Review,
        Favorite,
        Address,
        Car,
        Otp
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false
    }),
    UsersModule,
    AuthModule,
    MailModule,
    AdminModule,
    SocialLinkModule,
    DiscountTypeModule,
    DistrictModule,
    RegionModule,
    CategoryModule,
    BotModule,
    StoreSocialLinkModule,
    StoreModule,
    StoreSubscribeModule,
    DiscountModule,
    ReviewsModule,
    FavoritesModule,
    SmsModule,
    OtpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
