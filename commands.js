var url = require("url");
var http = require("http");
var https = require("https");
var querystring = require("querystring");

module.exports = function(bot, slack){
  bot.addCommand("ideabot help", "Show this help.", function(msg, args, channel, username) {
    var message = "I'm ideabot, the Saints Robotics Spontaneous Self-Operating System. Here's what I can do:";
    for(var i in bot.commands){
      var command = bot.commands[i];
      message += "\n" + command.trigger + " - " + command.help;
    }
    bot.sendMessage(message, channel);
  });

  bot.addCommand("ideabot ready", "Ready.", function(msg, args, channel, username) {
    bot.sendMessage("Ready.", channel);
  });

  bot.addCommand("ideabot add", "Ready.", function(msg, args, channel, username) {
    bot.sendMessage(args, channel);
  });

  /*
  bot.addTrigger(/(regional manager|rm|evangelist) for ([A-z ]+)/gi, function(msg, matches, channel, username) {
    if(matches[2]){
      matches[2] = matches[2].replace(/CodeDay/gi, "").trim();
      switch(matches[1].toLowerCase()){
        case "regional manager":
          getRegionalManager(msg, matches[2].split(" "), channel, username, bot);
          break;
        case "rm":
          getRegionalManager(msg, matches[2].split(" "), channel, username, bot);
          break;
        case "evangelist":
          getEvangelist(msg, matches[2].split(" "), channel, username, bot);
          break;
      }
    }else{
      bot.sendMessage("To search for an Evangelist/RM, use either `dozer rm [region]` or `dozer evangelist [region]`.", channel);
    }
  });
  */

  bot.on('unknownResponse', function(msg, channel, username, extra) {
    // on unknown call
  });

  slack.on('open', function() {
    slack.ws.on('message', function(message) {
      console.log(message);
      message = JSON.parse(message);
      if(message.text && message.text === "[countdown_start]" && message.ok) {
        console.log("Countdown message ts: " + message.ts);
        countdown.message = message.ts;
      }
    });
  });
};
