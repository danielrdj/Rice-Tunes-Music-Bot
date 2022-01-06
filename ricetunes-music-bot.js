require("dotenv").config({path: "./.env"});
const leave = require("./commands/leave")
const pause = require("./commands/pause")
const play = require("./commands/play")
const playFirst = require("./commands/playFirst")
const playInstead = require("./commands/playInstead")
const queueLength = require("./commands/queueLength")
const queueMove = require("./commands/queueMove")
const queuePrint = require("./commands/queuePrint")
const queueSwap = require("./commands/queueSwap")
const skip = require("./commands/skip")
const help = require("./commands/help")
const queueClear = require("./commands/queueClear")
const { Client, Intents } = require("discord.js");
const fs = require('fs');
const path = require('path');

myIntents = new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_INTEGRATIONS
]);

client = new Client({intents: myIntents})

client.on("ready", () => {
    console.log("Bot has come online.");

    // Clears the songQueue directory on bot initialization
    const directory = './songQueues';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
})

const PREFIX = "!";

client.on("messageCreate", (message) => {
    const voiceChannel = message.member.voice.channel;
    const textChannelName = message.channel.name; //There is a name attribute
    let riceMessage = "fRICE off!";
    let invalidCommandString = "That was an invalid command... OwO"
    let needVoiceChannelString = "You need to be in a voice channel to use this command!";
    //Checks if the message was send from a bot and that the user is in the correct channel "ricetunes-music
    if(!message.author.bot && textChannelName.includes("ricetunes-music")) {
        if (!message.content.startsWith(PREFIX)) {
            message.channel.send(riceMessage.concat(invalidCommandString)).then(() => {}); //There is a send method
        } else if (!voiceChannel){
            message.channel.send(riceMessage.concat(needVoiceChannelString)).then(() => {}); //There is a send method
        } else if (message.content.startsWith(PREFIX)) {
            let commandArray = message.content.split(" ");
            let firstArgument = commandArray[0].substring(1).toLowerCase();
            commandArray.shift();

            // Commands
            if (firstArgument === "clear" || firstArgument === "c"){
                queueClear.queueClear(client, message);
            } else if(firstArgument === "help" || firstArgument === "h" || firstArgument === "commands") {
                help.help(client, message).then().catch();
            } else if (firstArgument === "leave" || firstArgument === "l" || firstArgument === "stop"){
                leave.leave(client, message, voiceChannel);
            } else if (firstArgument === "pause" || firstArgument === "pa") {
                pause.pause(client, message);
            } else if (firstArgument === "play" || firstArgument === "p") {
                play.play(client, message, voiceChannel).then().catch();
            } else if (firstArgument === "playfirst" || firstArgument === "pf") {
                playFirst.playFirst(client, message, voiceChannel);
            } else if (firstArgument === "playinstead" || firstArgument === "pi") {
                playInstead.playInstead(client, message, voiceChannel);
            } else if (firstArgument === "queuelength" || firstArgument === "ql") {
                queueLength.printQueueLength(client, message);
            } else if (firstArgument === "queuemove" || firstArgument === "qm") {
                queueMove.queueMove(client, message);
            } else if (firstArgument === "queueprint" || firstArgument === "qp") {
                queuePrint.queuePrint(client, message, voiceChannel);
            } else if (firstArgument === "queueswap" || firstArgument === "qs") {
                queueSwap.queueSwap(client, message, voiceChannel);
            } else if (firstArgument === "skip" || firstArgument === "s") {
                skip.skip(client, message);
            } else {
                message.channel.send((riceMessage.concat(invalidCommandString))).then() //There is a send method
                console.log("Something went wrong.");
            }
        }
    }
})





console.log(client.login(process.env.BOT_TOKEN));