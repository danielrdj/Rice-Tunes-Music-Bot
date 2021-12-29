// Java Modules
const fs = require("fs");

/******************************************************
 * Reads the queue for the song queue for the
 * current guild
 *
 * @param guildDescriptor
 * @returns {string[]}
 ******************************************************/
function readQueueFromFile(guildDescriptor){
    let queue = fs.readFileSync("./songQueues/Queue" + guildDescriptor + ".txt", "utf8");
    queue = queue.split(",");
    return queue;
}

/******************************************************
 * Writes the queue for the song queue of the
 * current guild
 *
 * @param queueStringArray
 * @param guildDescriptor
 * @returns {string[]}
 ******************************************************/
function writeQueueToFile(queueStringArray, guildDescriptor){
    queueStringArray = queueStringArray.join(",");
    let filePath = "./songQueues/Queue" + guildDescriptor + ".txt";
    let fd = fs.openSync(filePath, "w+");
    fs.writeSync(fd, queueStringArray);
    fs.close(fd);
}

function queueFileExists(guildDescriptor){
    try{
        return fs.existsSync("./songQueues/Queue" + guildDescriptor + ".txt");
    } catch {
        return false;
    }
}

// Tests
// writeQueueToFile(["123, asd"], 925067998811811891)
// readQueueFromFile("1234")

module.exports = {
    readQueueFromFile,
    writeQueueToFile,
    queueFileExists
}