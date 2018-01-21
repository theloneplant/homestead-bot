# homestead-bot
This is the god bot. Soon it will be ready and then it will do EVERYTHING. BlackHatGuy stands no chance.

## Current Features
* Conversation via Cleverbot
* Youtube search
* Music streaming
* Google translate
* Meme posting
    * Request top posts from r/dankmemes and other meme subreddits and post them
* Dice rolling

## Feature Roadmap
* Google searches
* Image searches
* Reddit searches
* Playlist streaming with media control
* Post memes
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
            "clients": {
                "discord": {
                    "defaultVoiceChannel": "000000000000000000"
                }
            },
            "nicknames": [
                "nickname1",
                "nickname2"
            ],
            "prefix": "!"
        }
    }
}
~~~~

#### credentials.json
* **Cleverbot:** Used as a default response
* **Cleverbot.io:** Since Cleverbot has a limited number of requests, Cleverbot.io is used as a fallback since its API is free, albeit less entertaining than the standard Cleverbot
* **Google:** Used for general purpose Google APIs such as YouTube and Translate
* **Api.ai:** AKA DialogFlow, which is used for interpreting speech loosly as commands with parameters
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
                "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            }
        },
        "group2": {
            "discord": {
                "username": "username2#0000",
                "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            }
        }
    }
}
~~~~
