var fs = require("fs");
var url = require("url");
var http = require("http");
var https = require("https");
var querystring = require("querystring");

var file;

module.exports = function(bot, slack) {
  if (!fs.exists("ideas.dat", "")) {
    fs.writeFileSync("ideas.dat");
  }
  file = fs.readFileSync("ideas.dat");

  bot.addCommand("ideabot help", "Show this help.", function(msg, args, channel, username) {
    var message = "I'm ideabot, a bot used to record cool ideas. Here's what I can do:";
    for(var i in bot.commands) {
      var command = bot.commands[i];
      message += "\n" + command.trigger + " - " + command.help;
    }
    bot.sendMessage(message, channel);
  });

  bot.addCommand("ideabot ready", "Ready.", function(msg, args, channel, username) {
    bot.sendMessage("Ready.", channel);
  });

  bot.addCommand("ideabot add", "Adds a new idea.", function(msg, args, channel, username) {
    var str = args.join(" ");
    bot.sendMessage("Added idea: " + str, channel);
    fs.appendFile('ideas.dat', str + '\n', function (err) {
      if (err) throw err;
      console.log('Data appended: ' + str);
    });
  });

  bot.addCommand("ideabot show", "Shows existing ideas.", function(msg, args, channel, username) {
    var file = fs.readFileSync("ideas.dat", "utf8");
    bot.sendMessage(file, channel);
  });

  // Add a way to remove a line, number lines to be removed, blockquote ideas.

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
