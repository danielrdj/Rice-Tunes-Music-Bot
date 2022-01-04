const qrw = require("../support-js-files/queueReadingAndWriting");
const ytdl = require("ytdl-core");
const {pause} = require("./pause");
const ytSearch = require("yt-search");
const DiscordVoice = require('@discordjs/voice');
const {getVoiceConnection} = require("@discordjs/voice");
const {addToQueue, stripQueueItem} = require("../support-js-files/queueReadingAndWriting");

async function help (client, message) {
    let commandGreeting = "The following commands can be used to control the RiceTunes bot: \n"
    let bigLine = "-----------------------------------"
    commandGreeting = commandGreeting.concat(bigLine).concat("\n");
    let commands = [
        "help                    ---- h",
        "leave/stop        ---- l",
        "pause                 ---- pa",
        "play                    ---- p",
        "playFirst            ---- pf",
        "playInstead       ---- pi",
        "queueLength    ---- ql",
        "queueMove      ---- qm",
        "queueSwap      ---- qs"
    ];
    for (let i = 0; i < commands.length; ++i) {
        commandGreeting = commandGreeting.concat(commands[i]).concat("\n");
    }
    message.channel.send(commandGreeting + bigLine);
}


module.exports = {
    help,
};