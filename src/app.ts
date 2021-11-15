// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { Context, Markup, Telegraf, Telegram } from "telegraf";
import { Update } from "typegram";
import express from "express";

const expressApp = express();
const port = process.env.PORT || 3001;

expressApp.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`);

  const token: string = process.env.BOT_TOKEN as string;
  const telegram: Telegram = new Telegram(token);
  const bot: Telegraf<Context<Update>> = new Telegraf(token);
  const chatId: string = process.env.CHAT_ID as string;

  bot.start((ctx) => {
    ctx.reply(
      "Hello " + ctx.from.first_name + ", welcome to the Nym Coindesk bot💰"
    );
    ctx.reply(
      "What would you like to do?",
      Markup.inlineKeyboard([
        Markup.button.callback("Deposit", "deposit"),
        Markup.button.callback("Withdraw", "withdraw"),
        Markup.button.callback("Get Advice", "advice"),
      ])
    );
  });

  bot.help((ctx) => {
    ctx.reply("Send /start to begin");
  });

  bot.command("keyboard", (ctx) => {
    ctx.reply(
      "Keyboard",
      Markup.inlineKeyboard([
        Markup.button.callback("First option", "first"),
        Markup.button.callback("Second option", "second"),
      ])
    );
  });

  bot.on("text", (ctx) => {
    console.log("=== 2. text command START");
    ctx.reply(
      "You chose the " +
        (ctx.message.text === "first" ? "First" : "Second") +
        " Option!"
    );
    console.log("=== 2. text command END");
    if (chatId) {
      telegram.sendMessage(
        chatId,
        "This message was sent without your interaction!"
      );
    }
  });

  console.log("== Bot is Running ==");

  bot.command("quit", (ctx) => {
    ctx.telegram.leaveChat(ctx.message.chat.id);
    ctx.leaveChat();
  });

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
});
