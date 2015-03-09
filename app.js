// process.on('uncaughtException', function(err) {
//   console.error('Caught exception: ' + err);
// });

var Slack = require('slack-client');
var bot = require("./bot")();

var slack = new Slack(process.env.SLACK_KEY, true, true);
var slackReady = false;

slack.on('open', function() {

  var channels = [],
  groups = [],
  unreads = slack.getUnreadCount(),
  key;

  console.log("Slack connected... waiting 2 seconds for everything to connect.");

  setTimeout(function(){
    console.log("Binding bot to Slack...");
    slackReady = true;
    bot.on('sendMessage', function(message, channel){
      var m = slack.getChannelGroupOrDMByID(channel).send(message);
      console.log(m);
      return m;
    });
    console.log("Bot bound to Slack. Everything is ready.");
  }, 2000);
});

slack.on('error', function(error) {
  console.error('Error: %s', error);
  console.log(error);
});

slack.on('message', function(message) {
  var type = message.type,
  user = slack.getUserByID(message.user),
  time = message.ts,
  text = message.text,
  response = '';

  if (type === 'message' && user) {
    bot.processMessage(text, message.channel, user.name, {message: message});
  }
});

slack.login();

bot.on('handleError', function(err, channel, command) {
  bot.sendMessage("You broke something!\nError in command `" + command + "`:\n```" + err.stack + "```", channel);
});

require("./commands")(bot, slack);

var express = require('express')();

express.get('/', function(req, res) {
  res.sendfile('index.html');
});

var server = express.listen(process.env.PORT || 1337);
