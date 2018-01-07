# homestead-bot
Basic readme, should eventually be updated with more in depth instructions, feature list, etc.

## Setup
### Standard setup
* Add config files
* Install outside dependencies for the server:
  * npm
  * nodejs
  * ffmpeg
* Run `npm i`
* Start the server by running `node app.js`

### Docker setup:
* Add config files
* Install Docker if not used already
* Run build.sh
* If you make changes, you can run build.sh again and it should build much quicker since it won't need to install Debian or Node modules. It will show up when running `docker ps -a` as the name you specified in the config, and likewise you can view logs by running `docker logs name`

*Todo: Add fallback in build.sh if Docker isn't found or use a param*

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
        "name1": {
            "clients": {
                "discord": {
                    "defaultVoiceChannel": "000000000000000000"
                }
            },
            "nicknames": [
                "nickname1",
                "nickname2"
            ],
            "prefix": "/"
        },
        "name2": {
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
* **Google:** Used for general purpose Google APIs such as YouTube and Translator
* **Api.ai:** AKA DialogFlow, which is used for interpreting speech loosly as commands with parameters
* **Discord:** Used to interface with Discord's API. The config supports multiple Discord bots by assigning them to groups (name1 and name2 in this case)
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
        }
    },
    "agents": {
        "apiai": {
            "token":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }
    },
    "clients": {
        "name1": {
            "discord": {
                "username": "username1#0000",
                "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            }
        },
        "name2": {
            "discord": {
                "username": "username2#0000",
                "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            }
        }
    }
}
~~~~
