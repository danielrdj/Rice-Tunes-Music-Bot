const qrw = require("../support-js-files/queueReadingAndWriting");
const {videoFinder, playOrStop} = require("./play")
const {getVoiceConnection} = require("@discordjs/voice");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const {stripQueueItem} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");
function playFirst(client, message) {
    const guildDescriptor = message.guildId;
    let currentPlayer;
    let currentPlayerState;

    // Tries to assign states
    try {
        currentPlayerState = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
    } catch {currentPlayerState = ""}

    // Checks if there were no additional arguments and if player is paused to unpause
    if(message.content.split(" ").length === 1) {
        message.channel.send("You didn't give an song query.");
        return;
    } else if (!(message.content.split(" ").length === 1) && currentPlayerState === "paused") {
        pause(client, message);
        message.channel.send("The music has been un-paused and your song has been added to the queue.");
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