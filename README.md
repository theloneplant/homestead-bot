# homestead-bot
This is the god bot. Soon it will be ready and then it will do EVERYTHING. BlackHatGuy stands no chance.

## Table of Contents
* [Current Features](#current-features)
  + [Cleverbot](#cleverbot)
  + [YouTube Search](#youtube-search)
  + [Web Search](#web-search)
  + [Image Search](#image-search)
  + [Release Dates](#release-dates)
  + [Music Streaming](#music-streaming)
  + [Translate](#translate)
  + [Meme Posting](#meme-posting)
  + [Dice Rolling](#dice-rolling)
* [Feature Roadmap](#feature-roadmap)
* [Setup](#setup)
  + [Standard setup](#standard-setup)
  + [Docker setup](#docker-setup)
  + [Configs](#configs)
    - [server.json](#serverjson)
    - [credentials.json](#credentialsjson)

## Current Features
Note: Commands are flexible, you can word them loosly thanks to DialogFlow so you don't need to remember the exact command. Speak to the bot as if you were talking to a person.

### Cleverbot
This is the current default action. It will take whatever request you send, strip the message of nicknames/tagging and replace it with the word "you" to send to either Cleverbot or Cleverbot.io. Cleverbot.io is less entertaining, but has a completely free API which is used in case of Cleverbot running out of requests.

**Command format:** Anything

### YouTube Search
This command queries YouTube for a video, channel, or playlist and posts a link to it in chat.

**Command format:**

"Hey bot search youtube for XXX"

"Bot search for XXX on youtube"

### Web Search
This command queries Bing for a link related to the search and posts a link to it in chat.

**Command format:**

"Hey bot search for XXX"

"Bot look up XXX"

### Image Search
This command queries Bing for an image and posts a link to it in chat.

**Command format:**

"Hey bot search for pictures of XXX"

"Bot search for XXX photos"

### Release Dates
This command queries Bing for the release date for a movie, show, game, etc. and attempts to find the release date for it. If it can't find the direct answer then it'll return a relevant web search.

**Command format:**

"Hey bot what's the release date for XXX"

"Bot when does XXX come out"

### Music Streaming
Currently music streaming is very barebones. It only queries YouTube, has no media controls, and doesn't support playing playlists or channels. The bot will attempt to join whatever channel you are currently in. If you aren't in a voice channel, it'll attempt to connect to the group's default voice channel. To get the default voice channel, enable Developer Mode in Discord, right click on the voice channel you want, and select "Copy ID"

**Command format:**

"Bot play XXX"

"Hey bot play XXX on youtube"

### Translate
This will send a message through Google Translate and give you back the translated message. By default, the bot translates messages into English if you don't specify a language to translate it into.

**Command format:**

"Hey bot translate XXX"

"Bot translate XXX into german"

### Meme Posting
This will query Reddit for one of the subreddits you specify in the config. These subreddits can be weighted relative to each other, so a subreddit with a weight of 50 will have 2x the chance of being selected over a subreddit with a weight of 25. This will get posts made within the last 24 hours from Reddit and will attempt to find content that it hasn't posted already.

**Command format:**

"Bot post a meme"

"Hey bot gimme a meme"

### Dice Rolling
This command rolls dice. It can roll one dice, it can roll multiple dice, it can roll dice with modifiers, if can even divide dice rolls if that's what you're into. The default roll is 1d20 and all dice rolls are in the format of dX (equivalent of 1dX) or XdX.

**Command format:**

"Bot roll"

"Hey bot roll 3d6+5"

"Bot roll 42d100 - 3 + 2d4 / 5d3" (because this is very helpful)

## Feature Roadmap
* Google searches
* Image searches
* Playlist streaming with media control
* Reminders and timers
* Inside jokes
    * Map of keywords/phrases and responses
* Shit talk to other bots
* Storytelling
* Text based adventures
* Pokemon battles
* Insults/compliments
* Equation solving using Wolfram Alpha
* Jibberish
* Currency exchange
* DnD character generator
* Character name generator

## Setup
### Standard setup
* Add config files
* Install outside dependencies for the server:
  * npm
  * nodejs
  * ffmpeg
* Run `npm i` and `node app.js` to install modules and run the server

### Docker setup:
* Add config files
* Install Docker if not used already
* Run build.sh
* If you make changes, you can run build.sh again and it should build much quicker since it won't need to install Debian or Node modules. It will show up when running `docker ps -a` as the name you specified in the config, and likewise you can view logs by running `docker logs name`

*Todo: Add standard build script for non-docker use*

### Configs:

The bot requires two config files (relative to the root folder of the GitHub project):
* config/server.json
* config/credentials.json

Optional - If you include these files then the bot will try to run using https, otherwise it'll use http:
* ssl/ssl.key
* ssl/ssl.crt
* ssl/ssl.ca-bundle

These should've been given to you by your SSL provider

#### server.json
~~~~javascript
{
    "name": "homestead-bot",
    "port": "0000",
    "botId": "HOMESTEADBOT",
    "groups": {
        "group1": {
            "clients": {
                "discord": {
                    "defaultVoiceChannel": "000000000000000000"
                }
            },
            "agents": {
                "random": [
                    {
                        "action": "Cleverbot",
                        "params": {},
                        "chance": 0.05
                    },
                    {
                        "action": "PostMeme",
                        "params": {},
                        "chance": 0.05
                    }
                ]
            },
            "actions": {
                "meme": [
                    {
                        "subreddit": "XXXXXXXXXXXX",
                        "weight": 0.5
                    },
                    {
                        "subreddit": "XXXXXXXXXXXX",
                        "weight": 0.5
                    }
                ]
            },
            "nicknames": [
                "nickname1",
                "nickname2"
            ],
            "prefix": "/"
        },
        "group2": {
            // Similar structure to group1
        }
    }
}
~~~~

#### credentials.json
* **Cleverbot:** Used as a default response
* **Cleverbot.io:** Since Cleverbot has a limited number of requests, Cleverbot.io is used as a fallback since its API is free, albeit less entertaining than the standard Cleverbot
* **Google:** Used for general purpose Google APIs such as YouTube and Translate
* **Api.ai:** AKA DialogFlow, which is used for interpreting speech loosly as commands with parameters
* **Reddit:** Used to get posts from Reddit. Make sure to create your bot at https://www.reddit.com/prefs/apps as a script
* **Discord:** Used to interface with Discord's API. The config supports multiple Discord bots by assigning them to groups (group1 and group2 in this case)
~~~~javascript
{
    "actions": {
        "cleverbot": {
            "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        },
        "cleverbotio": {
            "user": "XXXXXXXXXXXXXXXX",
            "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        },
        "google": {
            "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        },
        "reddit": {
            "userAgent": "Any String (ex. homestead-bot)",
            "clientId": "XXXXXXXXXXXXXXXX",
            "clientSecret": "XXXXXXXXXXXXXXXX",
            "username": "XXXXXXXXXXXXXXXX",
            "password": "XXXXXXXXXXXXXXXX"
        }
    },
    "agents": {
        "apiai": {
            "token":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }
    },
    "clients": {
        "group1": {
            "discord": {
                "username": "username1#0000",
                "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            }
        },
        "group2": {
            "discord": {
                "username": "username2#0000",
                "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            }
        }
    }
}
~~~~
