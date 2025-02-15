import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { TelegrafExceptionFilter } from "../filters/telegraf-exception.filter";
import { AdminBotGuard } from "../guards/admin-bot.guard";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    if ("contact" in ctx.message!) {
      await this.botService.onContact(ctx);
    }
  }
  @Command("stop")
  async onStop(@Ctx() ctx: Context) {
    console.log("hello");
    await this.botService.onStop(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }

  @Command("car")
  async onCar(@Ctx() ctx: Context) {
    await this.botService.onCar(ctx);
  }

  @Hears("Yangi avtomobil qo'shish 🚗")
  async onAddNewCar(@Ctx() ctx: Context) {
    await this.botService.onAddNewCar(ctx);
  }

  @Hears("Mening avtobillarim 🚗")
  async onMyCars(@Ctx() ctx: Context) {
    await this.botService.onMyCars(ctx);
  }

  @Hears(/^\d{2}[A-Z]\d{3}[A-Z]{2}$|^\d{2}\d{3}[A-Z]{3}$/)
  async onAddCarNumber(@Ctx() ctx: Context) {
    await this.botService.onAddCarNumber(ctx);
  }
  @Hears(/^19\d{2}$^20[0-9][0-9]$||^201[0-9]$|^202[0-5]$/)
  async onAddCarYear(@Ctx() ctx: Context) {
    await this.botService.onAddCarYear(ctx);
  }
  @Action(/^carDel_+\d+/)
  async onDeleteCar(@Ctx() ctx: Context) {
    await this.botService.onDeleteCar(ctx);
  }

  @UseFilters(TelegrafExceptionFilter)
  @UseGuards(AdminBotGuard)
  @Command("admin")
  async onAdminCommand(@Ctx() ctx: Context) {
    await this.botService.admin_menu(ctx, `Xush Kelibsiz ADMIN 🙋‍♂️`);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    await this.botService.OnDeleteMessage(ctx);
  }

  // }

  // @Command('help')
  // async onHelpCommand(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("hozr iloji yo'q")
  // }
  // @Command('about')
  // async onAboutCommand(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("botti uyoq-buyoqlarini qarasangiz ma'lumotlar yozilgan")
  // }

  // @Command('inline')
  // async onInlineCommand(@Ctx() ctx: Context) {
  //   const inlineKeybord = [
  //     [
  //       {
  //         text: "Tugma1",
  //         callback_data: "button_1"
  //       },
  //       {
  //         text: "Tugma2",
  //         callback_data: "button_2"
  //       },
  //       {
  //         text: "Tugma3",
  //         callback_data: "button_3"
  //       },
  //     ],
  //     [
  //       {
  //         text: "Tugma4",
  //         callback_data: "button_4"
  //       },
  //       {
  //         text: "Tugma5",
  //         callback_data: "button_5"
  //       },
  //     ],
  //     [
  //       {
  //         text: "Tugma6",
  //         callback_data: "button_6"
  //       },
  //     ],
  //   ]
  //   await ctx.reply("Inline Keybord: Kerakli tugmani bosing", {
  //     reply_markup: {
  //       inline_keyboard: inlineKeybord
  //     }
  //   })
  // }

  // @Action('button_1')
  // async onButton1Action(@Ctx() ctx: Context) {
  //   await ctx.reply("1-tugma bosildi")
  // }
  // @Action(/^button_+[1-9]/)
  // async onButtonActionAny(@Ctx() ctx: Context) {
  //   const actionText = ctx.callbackQuery!["data"];
  //   const buttonId = actionText.split("_")[1]
  //   console.log(actionText);

  //   await ctx.reply(`${buttonId}-tugma bosildi`)
  // }

  // @Command('main')
  // async onMainButton(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("kerakli main tugmani bos", {
  //     ...Markup.keyboard([
  //       [Markup.button.contactRequest(`📞 telefon raqamingizni yuboring`)],
  //       [Markup.button.locationRequest(`📍 turgan manzilingizni yuboring`)],
  //       ["tugma1",],
  //       ["tugma2", "tugma3"],
  //       ["tugma4", "tugma5", "tugma6"]
  //     ])
  //   })
  // }

  // @Hears(/^tugma+\d+$/)
  // async onButtonHear(@Ctx() ctx: Context) {

  //   if('text' in ctx.message!){
  //     const buttonId = ctx.message.text.split("tugma")
  //     await ctx.replyWithHTML(`${buttonId[1]}-button bosildi`)
  //   }
  // }

  // @On("photo")
  // async onPhoto(@Ctx() ctx: Context) {
  //   if ('photo' in ctx.message!) {
  //     console.log(ctx.message!.photo);
  //     await ctx.replyWithPhoto(
  //       String(ctx.message.photo[ctx.message.photo.length - 1].file_id)
  //     )
  //   }

  // }

  // @On("video")
  // async onVideo(@Ctx() ctx: Context) {
  //   if ('video' in ctx.message!) {
  //     console.log(ctx.message!.video);
  //     await ctx.replyWithHTML(
  //       String(ctx.message.video.duration)
  //     )
  //   }
  // }

  // @On("sticker")
  // async onSticer(@Ctx() ctx: Context) {
  //   if ('sticker' in ctx.message!) {
  //     console.log(ctx.message!.sticker);
  //     await ctx.replyWithHTML(
  //       String(ctx.message.sticker.emoji)
  //     )
  //   }
  // }

  // @On("voice")
  // async onVoice(@Ctx() ctx: Context) {
  //   if ('voice' in ctx.message!) {
  //     console.log(ctx.message!.voice);
  //     await ctx.replyWithHTML(String(ctx.message.voice.duration))
  //     await ctx.replyWithAudio(String(ctx.message.voice.file_id))
  //   }
  // }

  // @On("invoice")
  // async onInVoice(@Ctx() ctx: Context) {
  //   if ('invoice' in ctx.message!) {
  //     console.log(ctx.message!.invoice);
  //     await ctx.replyWithHTML(String(ctx.message.invoice.currency))
  //   }
  // }
  // @On("document")
  // async onDocument(@Ctx() ctx: Context) {
  //   if ('document' in ctx.message!) {
  //     console.log(ctx.message!.document);
  //     await ctx.replyWithHTML(String(ctx.message.document))
  //   }
  // }
}
