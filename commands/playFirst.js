const qrw = require("../support-js-files/queueReadingAndWriting");
const {playOrStop} = require("./play")
const DiscordVoice = require("@discordjs/voice");
const {stripQueueItem} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");
const {hasArgsAndIsPaused} = require("../support-js-files/playingSupport")

function playFirst(client, message) {
    const guildDescriptor = message.guildId;
    let currentPlayer;
    let currentPlayerState;

    // Tries to assign states
    try {
        currentPlayerState = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
    } catch {currentPlayerState = ""}

    if(hasArgsAndIsPaused(client, message, currentPlayerState, "playFirst")){
        return;
    }

    // Adding to queue
    let newQueueItem = stripQueueItem(message.content);
    qrw.addToFrontOfQueue(guildDescriptor, newQueueItem);
    let currentQueue = qrw.readQueueFromFile(guildDescriptor);
    pause(client, message);
    try {
        currentPlayer = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player;
        playOrStop(currentQueue, message, currentPlayer).then();
    } catch {}
    pause(client, message);

}

module.exports = {
    playFirst,
};