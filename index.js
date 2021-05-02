const BootBot = require('bootbot');
const config = require('config');
const fetch = require("node-fetch");

var port = process.env.PORT || config.get('PORT');

const bot = new BootBot({
  accessToken: config.get('ACCESS_TOKEN'),
  verifyToken: config.get('VERIFY_TOKEN'),
  appSecret: config.get('APP_SECRET')
});

const MOVIE_API = "http://www.omdbapi.com/?apikey=8df4f6a8";

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	//console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi'], (payload, chat) => {
	console.log('The user said "hello" or "hi"!');

  chat.say("If you want movie info, tel me 'moie' and the movie name");
});

bot.hear(/movie (.*)/i, (payload, chat, data) => {
  chat.conversation((conversation) => {
    const movieName = data.match[1];
    console.log(movieName);

    fetch(MOVIE_API + '&t=' + movieName).then(res => res.json()).then(json => {
      console.log(JSON.stringify(json));

      if (json.Response == "False") {
        conversation.say("movie " + movieName + " not found")
      } else {
        conversation.say("year " + json.Year);
        conversation.say("Runtime " + json.Runtime);
      }
    })

    conversation.end();
  })
})

bot.start(port);