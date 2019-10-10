const TelegramBot = require( `node-telegram-bot-api` )
const cron = require(`node-cron`);
const TOKEN = `872713076:AAFoPDBhIO_NntSY_2-RW7kZgseT-FAjDpk`
const bot = new TelegramBot( TOKEN, { polling: true } )

var logError = function logError(msg) {
  return function (err) {
    return console.log(msg, err);
  };
};

var logSuccess = function(msg, match){
  return function(data){
    console.log( 'Success:', data);
  };
};

var sendEcho = function(msg, match){
  bot.sendMessage( msg.chat.id, match[ 1 ] )
      .then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/echo (.*)/, sendEcho);

var helloMsg = function(userName) {
	return `Hello! ${userName}.\n
  	You can use the following commands:\n
  	/start\r
  	/gimme meme <hourly, daily>\r
  	/gimme image <hourly, daily>\r
  	/gimme video <hourly, daily>\r
  	/gimme gif <hourly, daily>\r
  	/gimme today <daily>\r
  	/stop <meme, image, video, gif, today>\r`;
};

var userOrGroup = function(msg) {
  return msg.chat.first_name ? msg.chat.first_name : msg.chat.title;
};

var sendStart = function(msg, match){
  bot.sendMessage( msg.chat.id, helloMsg( userOrGroup(msg) ) )
  	.then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/start/, sendStart);

var sendMemePhoto = function(msg, match){
  bot.sendPhoto(msg.chat.id, 'https://www.ahnegao.com.br/wp-content/uploads/2019/10/lola.jpg')
  	.then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/gimme/, sendMemePhoto);

bot.on("polling_error", (err) => console.log(err));