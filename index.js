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
	return `Hello, ${userName}!\n
  	You can use the following commands:\n
  	/start\r
  	/gimme meme <hourly, daily>\r
  	/gimme image <hourly, daily>\r
  	/gimme video <hourly, daily>\r
  	/gimme gif <hourly, daily>\r
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

bot.onText( /\/start/, sendStart);

var sendMemePhoto = function(msg, match) {
  bot.sendPhoto(msg.chat.id, 'https://www.ahnegao.com.br/wp-content/uploads/2019/10/lola.jpg')
  	.then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/gimme image/, sendMemePhoto);

var gimmeDaily = function(msg, match) {
  var daily = `45 20 * * *`; 
  bot.sendMessage( msg.chat.id,`Your daily meme will be sent at ${daily}`); //todo: format date
  cron.schedule( daily, () => { //todo: add now time if not passed any hour
    bot.sendMessage(msg.chat.id,`Sending you daily meme, ${userOrGroup(msg)}!`);
    //bot.sendAudio(message.chat.id,'./remindersss.ogg');
  })
};

bot.onText( /\/gimme daily/, gimmeDaily);


var sendMemeVideo = function(msg, match) {
  bot.sendVideo(msg.chat.id, 'https://thumbs.gfycat.com/SpectacularColorfulFennecfox-mobile.mp4')
  	.then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/gimme video/, sendMemeVideo);

var sendMemeGif = function(msg, match) {
  bot.sendVideo(msg.chat.id, 'https://thumbs.gfycat.com/DeterminedNecessaryCatfish-mobile.mp4')
  	.then( logSuccess( msg, match ) )
      .catch( logError( 'Error:') );
};

bot.onText( /\/gimme gif/, sendMemeGif);