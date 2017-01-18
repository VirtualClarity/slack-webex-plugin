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
				console.log(matches[1]);
				var arguments = matches[1].trim();					// Get rid of any trailing or leading spaces
				var username_matches = arguments.match(self.config.username_pattern);
				console.log(username_matches);
				if(username_matches && self.config.specify_username)
				{	// We matched a username pattern and we were supposed to be looking for it
					var user = username_matches[0];				// Because we have capture groups in the pattern, [1] contains the username
					if(verbose)	{ console.log("Using provided user: " + user); }
					var handle_matches = user.match(/^@(\w+)/);
					if(handle_matches)
					{
						if(verbose)	{ console.log("Guessing user based on " + self.config.user_guess_property);	}
						sendLinkToGuessedUser(self, message, msg, handle_matches[1]);
					}
					else
					{
						sendLink(self, message, msg + user);
					}
				} 
				else if(!username_matches || !self.config.specify_username)
				{
					var user = message.user;
					if(verbose)	{ console.log("Using sender user: " + user); }
					if(verbose)	{ console.log("Guessing user based on " + self.config.user_guess_property);	}
					sendLinkToGuessedUser(self, message, msg, user);
				}
				else
				{
					sendHelp(message);
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

function sendHelp(bot, request)
{
	console.log("Message not correctly formatted. Printing usage message");
	bot.slacker.send('chat.postMessage',
	{
		channel: request.channel,
		parse: "full",
		text: "Usage: " + bot.config.help_message,
		username: bot.config.bot_name,
		unfurl_links: false,
		link_names: 1,
		icon_emoji: boot.config.emoji
	});
}

function sendLinkToGuessedUser(bot, request, link, user)
{
	bot.slacker.send('users.info', { user: user }, function(value)
	{ 
		var guessed_user = fetchFromObject(value, bot.config.user_guess_property);
		if(bot.config.user_guess_search)
		{
			guessed_user = guessed_user.replace(bot.config.user_guess_search, bot.config.user_guess_replace);
		}
		sendLink(bot, request, link + guessed_user)
	});
}

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
