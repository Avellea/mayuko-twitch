import tmi from 'tmi.js'
import { CHANNEL_NAME, BOT_USERNAME, OAUTH_TOKEN, BLOCKED_WORDS } from './constants';

const msgFile = require('../assets/messages.json');

const options = {
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);


function initBot() {
    client.connect().catch(console.error);
    setInterval(sendAutoMsg, 600000)
}

function sendAutoMsg(channel) {
    const keys = Object.keys(msgFile);
    const randIndex = Math.floor(Math.random() * keys.length);
    const randKey = keys[randIndex];
    const name = msgFile[randKey];  
    client.say(client.channels[0], name)    
    // console.log(randKey);
}


client.on('message', (channel, userstate, message, self) => {
    if(self) return;

	if(message.toLowerCase() === '!help') {
		client.say(channel, `@${userstate.username}, https://github.com/Avellea/Avellea.github.io/blob/master/other/twitchcommands.md`);
        return;
	} else if (message.toLowerCase() === '!emotes') {
        client.say(channel, `@${userstate.username}, https://hakurei.reeee.ee/5b3xjIaBo`)
        return;
    } else if (message.toLowerCase() === '!area') {
        client.say(channel, `@${userstate.username}, https://github.com/Avellea/Avellea/blob/main/area.png`)
        return;
    } else if (message.toLowerCase() === '!skin') {
        client.say(channel, `@${userstate.username}, https://github.com/Avellea/Avellea/blob/main/skins.md`)
        return;
    }

    checkTwitchChat(userstate, message, channel)

});


function checkTwitchChat(userstate, message, channel) {
    console.log(message)
    message = message.toLowerCase()
    let shouldSendMessage = false
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
    if (shouldSendMessage) {
        // tell user
        client.say(channel, `@${userstate.username}, sorry! Your message was deleted.`)
        // delete message
        client.deletemessage(channel, userstate.id)
    }
}


initBot();
