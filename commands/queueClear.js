const {readQueueFromFile, writeQueueToFile, queueFileExists} = require("../support-js-files/queueReadingAndWriting");

function queueClear (client, message) {
    const guildDescriptor = message.guildId;
    if(queueFileExists(guildDescriptor)) {
        let queue = readQueueFromFile(guildDescriptor);
        queue = [queue[0]];
        writeQueueToFile(queue, guildDescriptor);
        message.channel.send("The queue has been cleared!");
    } else {
        message.channel.send("There is no queue... UwU");
    }
}

module.exports = {
    queueClear,
}