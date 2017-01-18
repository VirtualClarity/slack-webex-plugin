# Slack Webex Plugin

Webex integration with [slack](http://slack.com).  

It does the following:

1. Produces links, when invoked, to open up your company's Webex page or your Webex personal room

## Usage

```javascript
git clone https://github.com/gsingers/slack-webex-plugin.git
cd slack-webex-plugin
npm install
```

Write your own configuration file (`config-example.js`) is a good starting point for building your own.

```javascript
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


//DO NOT EDIT
var slackbot = new slackbot.Bot(config);
slackbot.run();

```

Save this to a file in the root of the project then run your bot with:

    node your-config-file, eg.: node config-gsingers

This will launch the bot in your terminal based on provided configuration.

## Minimum configuration

You must change at least these things:

- `token`: Your Slack API token, get your token at https://api.slack.com/
- `webex_url`: A mapping of urls to webex urls.  Usually you just need to replace mypath with your company name or the like

## TODO:

- Deeper integration w/ the JIRA API
- Optionally restrict to certain config'd channels
