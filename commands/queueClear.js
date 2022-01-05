const {readQueueFromFile, writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");

function queueClear (client, message) {
    const guildDescriptor = message.guildId;
    let queue = readQueueFromFile(guildDescriptor);
    queue = [queue[0]];
    writeQueueToFile(queue, guildDescriptor);
    message.channel.send("The queue has been cleared!");
}

module.exports = {
    queueClear,
}