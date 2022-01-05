const qrw = require("../support-js-files/queueReadingAndWriting");
const {videoFinder, playOrStop} = require("./play")
const {getVoiceConnection} = require("@discordjs/voice");
const DiscordVoice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const {stripQueueItem, readQueueFromFile, swapQueueItems, writeQueueToFile, queueFileExists} = require("../support-js-files/queueReadingAndWriting");
const {pause} = require("./pause");

function queuePrint(client, message) {
    const guildDescriptor = message.guildId;
    let bigLine = "-----------------------------------"
    if (queueFileExists(guildDescriptor)) {
        let queue = readQueueFromFile(guildDescriptor);
        if (queue.length === 1 && queue[0] === "") {
            message.channel.send("There are no items in this queue");
            return;
        }

        let queueString = "Current Queue: \n";
        for (let i = 0; i < queue.length; ++i) {
            if(i === 0) {
                queueString = queueString + (i + 1) + (": ").concat(queue[i]).concat(" - Now Playing - ").concat("\n");
            } else {
                queueString = queueString + (i + 1) + (": ").concat(queue[i]).concat("\n");
            }
        }
        message.channel.send(bigLine.concat("\n") + queueString + bigLine);
    } else {
        message.channel.send("There are no items in this queue");
    }
}

module.exports = {
    queuePrint,
};