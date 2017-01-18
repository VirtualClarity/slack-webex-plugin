var slackbot = require('./lib/bot');

var config = {
    bot_name: "Webex",										// The name to post the URL as
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',	// Get a test token from https://api.slack.com/docs/oauth-test-tokens
    webex_url: "https://<mysite>.webex.com/meet/", 			// Replace <mysite> with your WebEx site
    pattern: /^\:webex:(.*)/,			 					// The pattern to look for before responding. Default is :webex:
															// The username is expected to follow this
	username_pattern: /^[\w\.]+$/,							// A regex which should match allowed username formats.
															// This one is "any number of word characters (a-z, A-Z, 0-9, _) or full stops in any order"
	help_message: ":webex: <webex-username> e.g. :webex: john.smith",
															//	What to print when the user gets it wrong. Update this if you change pattern
	link_preamble: "Join my meeting now at",				// A bit of text to go before the link. If you don't want this comment this line out
    verbose: true,											// Whether not to be verbose on stdout
    emoji: ":webex:",										// Add this emoji by following instructions at
															// https://get.slack.help/hc/en-us/articles/206870177-Create-custom-emoji
															// Icon provided in this repo
    user_guess_property: "user.profile.email",				// The user profile property that we should use to guess the user's webex username
															// if they don't provide it. Some choices:
															//		user.name					Slack username (e.g. jsmith)
															//		user.real_name				Slack real name (e.g. John Smith)
															//		user.profile.first_name		Slack first name (e.g. John)
															//		user.profile.last_name		Slack last name (e.g. Smith)
															//		user.profile.email			Slack email (eg. john.smith@company.com)
	user_guess_search: "@company.com",						// If you want to manipulate the guessed username you can do a search and replace on the
	user_guess_replace: ""									// result. This example removes the domiain part of the email address

};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();
