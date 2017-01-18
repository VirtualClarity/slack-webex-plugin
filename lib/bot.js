var _ = require('underscore');
var slack = require('./slacker');
var slackbot = require('node-slackbot');
/**
 * Slackbot to integrate JIRA.
 *
 * The main thing it does right now is auto-expand links, but since we are bringing in the JIRA plugin, there is more it can do
 *
 * See config-example.js for configuration
 *
 * To run:  node config-XXX.js	 (where XXX is the name of your config
 *
 * See:
 * https://www.npmjs.com/package/node-slackbot
 * https://www.npmjs.com/package/jira
 */
var Bot = function (config) {
  var self = this;
  this.config = _.defaults(config, {
    bot_name: "WebexBot",
    emoji: ":webex:",
    post: true
  });

  this.slacker = new slack.Slacker({ token: this.config.token });
  return this;
};

Bot.prototype.run = function ()
{
	var self = this;
	var verbose = self.config.verbose;
	var bot = new slackbot(this.config.token);
	bot.use(function (message, cb)
	{
		if('message' == message.type && message.text != null && message.subtype != "bot_message")
		{
			if(verbose)
			{
				console.log(message);
			}
			var matches = message.text.match(self.config.pattern);
			if(matches && matches.length > 0)
			{	// The message matched self.config.pattern
				var msg = "";
				if(self.config.link_preamble)
				{
					msg += self.config.link_preamble + " ";
				}
				msg += self.config.webex_url;
				
				// Find out if a WebEx username was provided
				var user = matches[1];			// Because we have capture groups in the pattern, [1] contains the username
				user = user.trim();					// Get rid of any trailing or leading spaces
				if(user.length > 0 && !user.match(/\s+/) && user.match(self.config.username_pattern))
				{
					if(verbose)
					{
						console.log("Using provided user: " + user);
					}
					self.slacker.send('users.info',	{ user: message.user }, function(value) { sendLink(self, message, msg + user) });
				} 
				else if(user.length == 0)
				{
					if(verbose)
					{
						console.log("Guessing user based on " + self.config.user_guess_property);
					}
					self.slacker.send('users.info',	{ user: message.user }, function(value) { sendLink(self, message, msg + fetchFromObject(value, self.config.user_guess_property)) });
				}
				else
				{
					console.log("Message not correctly formatted. Printing usage message");
					self.slacker.send('chat.postMessage',
					{
						channel: message.channel,
						parse: "full",
						text: "Usage: " + self.config.help_message,
						username: self.config.bot_name,
						unfurl_links: false,
						link_names: 1,
						icon_emoji: self.config.emoji
					});
				}
				if (verbose)
				{	//TODO: replace w/ better logging
					console.log(message.user + ' said: ' + message.text);
				}
}
		}
		cb();
	});
	bot.connect();
};

exports = module.exports.Bot = Bot;

function sendLink(bot, request, link)
{
	bot.slacker.send('chat.postMessage',
	{
		channel: request.channel,
		parse: "full",
		text: link,
		username: bot.config.bot_name,
		unfurl_links: false,
		link_names: 1,
		icon_emoji: bot.config.emoji
	});
}

function fetchFromObject(obj, prop) {

    if(typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if(_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}
