require("dotenv").config();
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
const stop = require("./commands/stop")
/*
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
 */
const { Client, Intents } = require("discord.js");
/*
const {
    joinVoiceChannel,
    createAudioPlayer,
    getVoiceConnection,
    AudioPlayerStatus,
    createAudioResource,
    getGroups
} = require('@discordjs/voice');
*/
const DiscordVoice = require('@discordjs/voice');

const {
    queueFileExists,
    writeQueueToFile,
    readQueueFromFile,
    addToQueue
} = require("./support-js-files/queueReadingAndWriting");

//const qrw = require("./support-js-files/queueReadingAndWriting");


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
})

const PREFIX = "!";

client.on("messageCreate", (message) => {
    const voiceChannel = message.member.voice.channel;
    let riceMessage = "fRICE off!";
    let invalidCommandString = "You entered an invalid command! Enter a valid command instead!";
    let needVoiceChannelString = "You need to be in a voice channel to use this command!";

    if(!message.author.bot) {
        if (!message.content.startsWith(PREFIX)) {
            message.reply(riceMessage.concat(invalidCommandString)).then(() => {});
        } else if (!voiceChannel){
            message.reply(riceMessage.concat(needVoiceChannelString)).then(() => {});
        } else if (message.content.startsWith(PREFIX) && !(message.content.split(" ").length === 1)){
            let commandArray = message.content.split(" ");
            let firstArgument = commandArray[0].substring(1);
            commandArray.shift();

            switch(firstArgument) {
                case "leave":
                    leave.leave(client, message, voiceChannel);
                    break;
                case "pause":
                    pause.pause(client, message, voiceChannel);
                    break;
                case "play":
                    play.play(client, message, voiceChannel).then();
                    break;
                case "playFirst":
                    playFirst.playFirst(client, message, voiceChannel);
                    break;
                case "playInstead":
                    playInstead.playInstead(client, message, voiceChannel);
                    break;
                case "queueLength":
                    queueLength.queueLength(client, message, voiceChannel);
                    break;
                case "queueMove":
                    queueMove.queueMove(client, message, voiceChannel);
                    break;
                case "queuePrint":
                    queuePrint.queuePrint(client, message, voiceChannel);
                    break;
                case "queueSwap":
                    queueSwap.queueSwap(client, message, voiceChannel);
                    break;
                case "skip":
                    skip.skip(client, message, voiceChannel);
                    break;
                case "stop":
                    stop.stop(client, message, voiceChannel);
                    break;
                default:
                    message.reply(riceMessage.concat(invalidCommandString)).then(() => {});
                    console.log("Something went wrong.");
                    break;
            }
        }
    }
})





console.log(client.login(process.env.BOT_TOKEN));