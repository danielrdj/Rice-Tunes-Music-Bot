const qrw = require("../support-js-files/queueReadingAndWriting")
function queueLength(client, message, voiceChannel) {
    const guildDescriptor = message.guildId;
    let queue = qrw.readQueueFromFile(guildDescriptor);
    if(queue[0] === ""){
        message.channel.send(("There are ") + 0 + (" items in the queue."));
    } else {
        message.channel.send(("There are ") + queue.length + (" items in the queue."));
    }
}

module.exports = {
    queueLength,
};