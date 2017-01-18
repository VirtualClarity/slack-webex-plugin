var slackbot = require('./lib/bot');

var config = {
    bot_name: "WebexBot",									// The name to post the URL as
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',	// Get a test token from https://api.slack.com/docs/oauth-test-tokens
    webex_url: "https://<mysite>.webex.com/meet/", 			// Replace <mysite> with your WebEx site
    pattern: /^\:webex(.*)/,			 					// The pattern to look for before responding. Default is :webex
															// The username is expected to follow this
	username_pattern: /^[\w\.]+$/,							// A regex which should match allowed username formats.
															// This one is "any number of word characters (a-z, A-Z, 0-9, _) or full stops in any order"
	help_message: ":webex <webex-username> e.g. :webex john.smith",	//	What to print when the user gets it wrong. Update this if you 
															// change pattern
    verbose: true,											// Whether not to be verbose on stdout
    emoji: ":webex:"										//NOTE: you'll need to add this emoji

};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();
