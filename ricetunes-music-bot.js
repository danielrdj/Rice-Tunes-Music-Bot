require("dotenv").config();
// Ricetunes Modules
const {leave} = require("./commands/leave")
const {pause} = require("./commands/pause")
const {play} = require("./commands/play")
const {playFirst} = require("./commands/playFirst")
const {playInstead} = require("./commands/playInstead")
const {queueLength} = require("./commands/queueLength")
const {queueMove} = require("./commands/queueMove")
const {queuePrint} = require("./commands/queuePrint")
const {queueSwap} = require("./commands/queueSwap")
const {skip} = require("./commands/skip")
const {stop} = require("./commands/stop")
// Discord JS Module
const {Client, Intents} = require("discord.js");
// Support Module
const {retrieveCommand, commandHasArguments} = require("./support-js-files/mainSupport");


let riceMessage = "fRICE off! ";
let invalidCommandString = "You entered an invalid command! Enter a valid command instead!";
let needVoiceChannelString = "You need to be in a voice channel to use this command!";
let needMoreArguments = "You need arguments for this command!";
let songQueue = [];

const PREFIX = "!";

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

client.setMaxListeners(15);

client.on("ready", () => {
    console.log("Bot has come online.");
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "leave" && !message.author.bot){
        leave(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "pause" && !message.author.bot){
        pause(client);
    }
})

client.on("messageCreate", (message) =>{
    let command = retrieveCommand(message.content)
    let messageContent = message.content.split(" ");

    if(command === "play" && commandHasArguments(messageContent) && !message.author.bot){
        play(client, message).then();
    } else {
        if (!message.author.bot) {
            message.reply(riceMessage + needMoreArguments).then();
        }
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "playFirst" && !message.author.bot){
        playFirst(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "playInstead" && !message.author.bot){
        playInstead(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "queueLength" && !message.author.bot){
        queueLength(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "queueMove" && !message.author.bot){
        queueMove(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "queuePrint" && !message.author.bot){
        queuePrint(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "queueSwap" && !message.author.bot){
        queueSwap(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "skip" && !message.author.bot){
        skip(client);
    }
})

client.on("messageCreate", (message) =>{
    let messageContent = retrieveCommand(message.content)
    if(messageContent === "stop" && !message.author.bot){
        stop(client);
    }
})



console.log(client.login(process.env.BOT_TOKEN));