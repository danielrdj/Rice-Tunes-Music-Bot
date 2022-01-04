const qrw = require("../support-js-files/queueReadingAndWriting");
const {videoFinder, playOrStop} = require("./play")
const {getVoiceConnection} = require("@discordjs/voice");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const {stripQueueItem, readQueueFromFile, swapQueueItems, writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");


function queueSwap(client, message, voiceChannel) {
    const guildDescriptor = message.guildId;
    let indices = message.content;
    indices = qrw.stripQueueItem(indices).split(" ");

    if(!(indices.length === 2)){
        message.channel.send("You did not give the correct number of arguments for this command.");
        return;
    }

    let queue = readQueueFromFile(guildDescriptor);
    try {
        swapQueueItems(indices[0], indices[1], queue);
    } catch (err) {
        message.channel.send(err.message);
        return;
    }
    writeQueueToFile(queue, guildDescriptor);
}

module.exports = {
    queueSwap,
};