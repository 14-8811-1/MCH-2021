const BootBot = require("bootbot");
const config = require("config");
const fetch = require("node-fetch");
const {ask} = require("./app/helpers/bot-helper")

const searchPackages = require("./app/modules/search-packages");
const packageInfo = require("./app/modules/package-info");

var port = process.env.PORT || config.get("PORT");

const bot = new BootBot({
  accessToken: config.get("ACCESS_TOKEN"),
  verifyToken: config.get("VERIFY_TOKEN"),
  appSecret: config.get("APP_SECRET")
});

let botModules = [searchPackages, packageInfo];
let messages = [];
botModules.forEach((bModule) => {
  bot.module(bModule.botModule);
  messages.push(bModule.keywords);
})

bot.on("message", (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.hear([/^(?!.*(search modules|module info|Search modules|Module info))/], async (payload, chat) => {
  // await chat.say({ text: "Hi, I'll help you find info about modules.", buttons: messages });
  await chat.say("Hi, You can ask me to 'search modules' or to get 'module info'.");
  // await ask(chat, {
  //   text: "Hi, You can ask me to 'search modules' or to get 'module info'.",
  //   quickReplies: messages
  // });
});


bot.start(port);