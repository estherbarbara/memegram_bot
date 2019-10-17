const axios = require('axios'); 
const TelegramBot = require( `node-telegram-bot-api` )
const cron = require(`node-cron`);
const TOKEN = `872713076:AAFoPDBhIO_NntSY_2-RW7kZgseT-FAjDpk`
const bot = new TelegramBot( TOKEN, { polling: true } )

bot.on("polling_error", (err) => console.log(err));

var logError = function logError(msg) {
  return function (err) {
    return console.log(msg, err);
  };
};

var logSuccess = function(msg, match) {
  return function(data){
    console.log( 'Success:', data);
  };
};

var sendEcho = function(msg, match) {
  bot.sendMessage( msg.chat.id, match[ 1 ] )
      .then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/echo (.*)/, sendEcho);

var helloMsg = function(userName) {
	return `Olá, ${userName}!\n
  	Você pode usar os seguintes comandos:\n
  	/help - Lista de comandos\r
  	/gimme meme - Um meme aleatório\r
  	/gimme image\r
  	/gimme video\r
  	/gimme gif\r
  	/gimme today <daily>\r
  	/stop <meme, image, video, gif, today>`;
};

var userOrGroup = function(msg) {
  return msg.chat.first_name ? msg.chat.first_name : msg.chat.title;
};

var sendStart = function(msg, match) {
  bot.sendMessage( msg.chat.id, helloMsg( userOrGroup(msg) ) )
  	.then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/help/, sendStart);

var sendMemePhoto = function(msg, match) {
  axios.get('http://127.0.0.1:5000/photo').then(function (response) {
      // handle success
      const imageLink = response.data.src;
      const title = response.data.title;
      bot.sendPhoto(msg.chat.id, imageLink, {caption : title})
          .then( logSuccess( msg, match ) )
          .catch( logError( 'Error:') );
      });
};

bot.onText( /\/gimme image/, sendMemePhoto);

// var gimmeDaily = function(msg, match) {
//   var daily = `45 20 * * *`; 
//   bot.sendMessage( msg.chat.id,`Your daily meme will be sent at ${daily}`); //todo: format date
//   cron.schedule( daily, () => { //todo: add now time if not passed any hour
//     bot.sendMessage(msg.chat.id,`Sending you daily meme, ${userOrGroup(msg)}!`);
//     //bot.sendAudio(message.chat.id,'./remindersss.ogg');
//   })
// };

// bot.onText( /\/gimme daily/, gimmeDaily); //todo: fix the command to get a specific format of meme


var sendMemeVideo = function(msg, match) {
  axios.get('http://127.0.0.1:5000/video').then(function (response) {
      // handle success
      const videoLink = response.data.src;
      const title = response.data.title;
      bot.sendMessage( msg.chat.id, `${title}:\n${videoLink}` )
  	    .then( logSuccess( msg, match ) )
        .catch( logError( 'Error:'));
      });
};

bot.onText( /\/gimme video/, sendMemeVideo);

var sendMemeGif = function(msg, match) {
  axios.get('http://127.0.0.1:5000/gif').then(function (response) {
      // handle success
      const imageLink = response.data.src;
      const title = response.data.title;
      bot.sendMessage(msg.chat.id, `${title}:\n${imageLink}`)
          .then( logSuccess( msg, match ) )
          .catch( logError( 'Error:') );
      });
};

bot.onText( /\/gimme gif/, sendMemeGif);


var sendMemeRandom = function(msg, match) {
  axios.get('http://127.0.0.1:5000/meme').then(function (response) {
      // handle success
      const type = response.data.type;
      console.log(type);
      const title = response.data.title;
      const memeLink = response.data.src;
      switch (type) {
        case 'images':
          bot.sendPhoto(msg.chat.id, memeLink, {caption : title})
            .then( logSuccess( msg, match ) )
            .catch( logError( 'Error:'));
          break;
        case 'videos':
          bot.sendMessage(msg.chat.id, `${title}:\n${memeLink}`)
            .then( logSuccess( msg, match ) )
            .catch( logError( 'Error:'));
          break;
        case 'gifs':
          bot.sendMessage(msg.chat.id, `${title}:\n${memeLink}`)
            .then( logSuccess( msg, match ) )
            .catch( logError( 'Error:'));
          break;
      }
  });
};

bot.onText( /\/gimme meme/, sendMemeRandom);