const qrw = require("../support-js-files/queueReadingAndWriting")
function queueLength(client, message) {
    const guildDescriptor = message.guildId;
    let queue = qrw.readQueueFromFile(guildDescriptor);
    if(queue[0] === ""){
        return 0;
    } else {
        return queue.length;
    }
}

function printQueueLength (client, message) {
    message.channel.send("The queue is currently " + queueLength(client, message) + " items in length.");
}

module.exports = {
    queueLength,
    printQueueLength,
};