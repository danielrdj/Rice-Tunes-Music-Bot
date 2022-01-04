const qrw = require("../support-js-files/queueReadingAndWriting");
const {videoFinder, playOrStop, play} = require("./play")
const {getVoiceConnection} = require("@discordjs/voice");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const {stripQueueItem, readQueueFromFile, swapQueueItems, writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");
function skip(client, message, voiceChannel) {
    const guildDescriptor = message.guildId;
    let currentQueue;
    let currentPlayer;


    // Adding to queue
    qrw.removeFrontOfQueue(guildDescriptor);
    currentQueue = readQueueFromFile(guildDescriptor);
    pause(client, message);
    try {
        currentPlayer = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player;
        playOrStop(currentQueue, message, currentPlayer).then();
    } catch {}
    pause(client, message);
}

module.exports = {
    skip,
};