const qrw = require("../support-js-files/queueReadingAndWriting");
const {videoFinder, playOrStop} = require("./play")
const {getVoiceConnection} = require("@discordjs/voice");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const {stripQueueItem, readQueueFromFile, swapQueueItems, writeQueueToFile, insertIntoQueue} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");

function queueMove(client, message, voiceChannel) {
    const guildDescriptor = message.guildId;
    let insertionIndex = stripQueueItem(message.content);
    let currentPlayer;
    insertIntoQueue(guildDescriptor, insertionIndex);
    let currentQueue = qrw.readQueueFromFile(guildDescriptor);
    pause(client, message);
    try {
        currentPlayer = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player;
        playOrStop(currentQueue, message, currentPlayer).then();
    } catch {}
    pause(client, message);

}

module.exports = {
    queueMove,
};