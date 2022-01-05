const {readQueueFromFile, queueFileExists} = require("../support-js-files/queueReadingAndWriting");

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
            let queueItem = "**" + queue[i] + "**";
            if(i === 0) {
                queueString = queueString + (i + 1) + (":  ").concat(queueItem).concat(" - Now Playing - ").concat("\n");
            } else {
                queueString = queueString + (i + 1) + (": ").concat(queueItem).concat("\n");
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