const qrw = require("../support-js-files/queueReadingAndWriting");
const {playOrStop} = require("./play")
const DiscordVoice = require("@discordjs/voice");
const {stripQueueItem, insertIntoQueue} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");

function queueMove(client, message) {
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