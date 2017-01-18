var slackbot = require('./lib/bot');

var config = {
    bot_name: "WebexBot",									// The name to post the URL as
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',	// Get a test token from https://api.slack.com/docs/oauth-test-tokens
    webex_url: "https://<mysite>.webex.com/meet/", 			// Replace <mysite> with your WebEx site
    pattern: /^\:webex\s+([\w\.]+)\s*$/, 					// The pattern to look for before responding. Default is :webex <username>
    verbose: true,											// Whether not to be verbose on stdout
    emoji: ":webex:"										//NOTE: you'll need to add this emoji

};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();
