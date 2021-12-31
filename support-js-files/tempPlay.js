// Java Modules
const fs = require("fs");

/******************************************************
 * Reads the queue for the song queue for the
 * current guild
 *
 * @param guildDescriptor
 * @returns {string[]}
 ******************************************************/
async function readQueueFromFile(guildDescriptor){
    let filePath = "./songQueues/Queue" + guildDescriptor + ".txt";

    fs.open(filePath, "r", async function (error, fd) {
        let bufferSize = fs.fstatSync(fd).size;
        let buffer = new Buffer(bufferSize);
        await fs.read(fd, buffer, 0, bufferSize, null, function (error, bytesRead, buffer) {
            fs.close(fd);
            console.log(buffer);
        });
    });
}



/******************************************************
 * Writes the queue for the song queue of the
 * current guild
 *
 * @param queueStringArray
 * @param guildDescriptor
 * @returns {string[]}
 ******************************************************/
async function writeQueueToFile(queueStringArray, guildDescriptor){
    queueStringArray = queueStringArray.join(",");
    let filePath = "./songQueues/Queue" + guildDescriptor + ".txt";
    //let fd = fs.openSync(filePath, "w+");
    fs.writeFile(filePath, queueStringArray, (err)=>{return err});
    //fs.close(fd);
}

async function queueFileExists(guildDescriptor){
    fs.promises.stat("./songQueues/Queue" + guildDescriptor + ".txt").catch(() => {return false});
    return true;
}

async function addToQueue(guildDescriptor, arguments) {
    if (await queueFileExists(guildDescriptor)){
        let queue = readQueueFromFile(guildDescriptor);
        if (queue[0] === ""){
            queue.shift();
        }
        queue.push(arguments);
        writeQueueToFile(queue, guildDescriptor);
    } else {
        let queue = [arguments];
        writeQueueToFile(queue, guildDescriptor);
    }
}

// Tests
// writeQueueToFile(["123, asd"], 925067998811811891)
// readQueueFromFile("1234")

module.exports = {
    readQueueFromFile,
    writeQueueToFile,
    queueFileExists,
    addToQueue,
}