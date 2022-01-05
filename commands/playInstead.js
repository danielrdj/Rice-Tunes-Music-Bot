const qrw = require("../support-js-files/queueReadingAndWriting");
const {videoFinder, playOrStop} = require("./play")
const {getVoiceConnection} = require("@discordjs/voice");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const {stripQueueItem} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");
const {hasArgsAndIsPaused} = require("../support-js-files/playingSupport")

function playInstead(client, message) {
    const guildDescriptor = message.guildId;
    let currentPlayer;
    let currentPlayerState;

    // Tries to assign states
    try {
        currentPlayerState = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
    } catch {currentPlayerState = ""}

    if(hasArgsAndIsPaused(client, message, currentPlayerState, "playInstead")){
        return;
    }

    // Adding to queue
    let newQueueItem = stripQueueItem(message.content);
    qrw.replaceFrontOfQueue(guildDescriptor, newQueueItem);
    let currentQueue = qrw.readQueueFromFile(guildDescriptor);
    pause(client, message);
    try {
        currentPlayer = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player;
        playOrStop(currentQueue, message, currentPlayer).then();
    } catch {}
    pause(client, message);
}

module.exports = {
    playInstead,
};