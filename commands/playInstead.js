const qrw = require("../support-js-files/queueReadingAndWriting");
const {playOrStop} = require("./play")
const DiscordVoice = require("@discordjs/voice");
const {stripQueueItem} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");
const {hasArgsAndIsPaused, videoFinder} = require("../support-js-files/playingSupport")

async function playInstead(client, message) {
    const guildDescriptor = message.guildId;
    let currentPlayer;
    let currentPlayerState;

    // Tries to assign states
    try {
        currentPlayerState = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
    } catch (err) {currentPlayerState = ""}

    if(await hasArgsAndIsPaused(client, message, currentPlayerState, "playInstead")){
        return;
    }

    // Adding to queue
    let newQueueItem = stripQueueItem(message.content);
    let video = await videoFinder(newQueueItem);
    let videoName = video.title;
    qrw.replaceFrontOfQueue(guildDescriptor, videoName);
    let currentQueue = qrw.readQueueFromFile(guildDescriptor);
    pause(client, message);
    try {
        currentPlayer = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player;
        playOrStop(currentQueue, message, currentPlayer).then();
    } catch (err) {}
    pause(client, message);
}

module.exports = {
    playInstead,
};