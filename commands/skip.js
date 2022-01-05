const qrw = require("../support-js-files/queueReadingAndWriting");
const {playOrStop} = require("./play")
const DiscordVoice = require("@discordjs/voice");
const {readQueueFromFile, queueFileExists} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");
function skip(client, message) {
    const guildDescriptor = message.guildId;
    let currentQueue;
    let currentPlayer;
    if(!queueFileExists(guildDescriptor)){
        message.channel.send(`The queue does not exist!!! OwO`);
        return;
    }

    // Adding to queue
    let removedItem = qrw.removeFrontOfQueue(guildDescriptor)
    message.channel.send(`**${removedItem}** has been skipped!`);
    currentQueue = readQueueFromFile(guildDescriptor);
    if (currentQueue[0] === undefined){
        message.channel.send(`The queue is empty!!! OwO`);
        return;
    }
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