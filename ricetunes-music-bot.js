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
const help = require("./commands/help")
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
    let invalidCommandString = "That was an invalid command... OwO"
    let needVoiceChannelString = "You need to be in a voice channel to use this command!";

    if(!message.author.bot) {
        if (!message.content.startsWith(PREFIX)) {
            message.reply(riceMessage.concat(invalidCommandString)).then(() => {});
        } else if (!voiceChannel){
            message.reply(riceMessage.concat(needVoiceChannelString)).then(() => {});
        } else if (message.content.startsWith(PREFIX)) {
            let commandArray = message.content.split(" ");
            let firstArgument = commandArray[0].substring(1).toLowerCase();
            commandArray.shift();

            // Commands
            if (firstArgument === "help" || firstArgument === "h") {
                help.help(client, message).then();
            } else if (firstArgument === "leave" || firstArgument === "l" || firstArgument === "stop"){
                leave.leave(client, message, voiceChannel);
            } else if (firstArgument === "pause" || firstArgument === "pa") {
                pause.pause(client, message);
            } else if (firstArgument === "play" || firstArgument === "p") {
                play.play(client, message, voiceChannel).then();
            } else if (firstArgument === "playfirst" || firstArgument === "pf") {
                playFirst.playFirst(client, message, voiceChannel);
            } else if (firstArgument === "playinstead" || firstArgument === "pi") {
                playInstead.playInstead(client, message, voiceChannel);
            } else if (firstArgument === "queuelength" || firstArgument === "ql") {
                queueLength.queueLength(client, message, voiceChannel);
            } else if (firstArgument === "queuemove" || firstArgument === "qm") {
                queueMove.queueMove(client, message, voiceChannel);
            } else if (firstArgument === "queueprint" || firstArgument === "qp") {
                queuePrint.queuePrint(client, message, voiceChannel);
            } else if (firstArgument === "queueswap" || firstArgument === "qs") {
                queueSwap.queueSwap(client, message, voiceChannel);
            } else if (firstArgument === "skip" || firstArgument === "s") {
                skip.skip(client, message, voiceChannel);
            } else {
                message.reply(riceMessage.concat(invalidCommandString)).then(() => {});
                console.log("Something went wrong.");
            }
        }
    }
})





console.log(client.login(process.env.BOT_TOKEN));