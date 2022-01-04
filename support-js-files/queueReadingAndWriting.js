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
    fs.promises.stat("./songQueues/Queue" + guildDescriptor + ".txt").catch(() => {return false});
    return true;
}

function addToQueue(guildDescriptor, arguments) {
    if (queueFileExists(guildDescriptor)){
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

function addToFrontOfQueue(guildDescriptor, arguments) {
    if (queueFileExists(guildDescriptor)){
        let queue = readQueueFromFile(guildDescriptor);
        if (queue[0] === ""){
            queue.shift();
        }
        queue.unshift(arguments);
        writeQueueToFile(queue, guildDescriptor);
    } else {
        let queue = [arguments];
        writeQueueToFile(queue, guildDescriptor);
    }
}

function replaceFrontOfQueue(guildDescriptor, arguments) {
    if (queueFileExists(guildDescriptor)){
        let queue = readQueueFromFile(guildDescriptor);
        if (queue[0] === ""){
            queue.shift();
        }
        queue[0] = arguments;
        writeQueueToFile(queue, guildDescriptor);
    } else {
        let queue = [arguments];
        writeQueueToFile(queue, guildDescriptor);
    }
}

function insertIntoQueue(guildDescriptor, insertionIndex) {
    if (queueFileExists(guildDescriptor)){
        let queue = readQueueFromFile(guildDescriptor);
        if (queue[0] === ""){
            queue.shift();
        }
        queue.splice(insertionIndex, 0, queue[0])
        queue.shift();
        writeQueueToFile(queue, guildDescriptor);
    } else {
        let queue = [arguments];
        writeQueueToFile(queue, guildDescriptor);
    }
}

function removeFrontOfQueue(guildDescriptor) {
    if (queueFileExists(guildDescriptor)){
        let queue = readQueueFromFile(guildDescriptor);
        if (queue[0] === ""){
            queue.shift();
        }
        queue.shift();
        writeQueueToFile(queue, guildDescriptor);
    } else {
        let queue = [arguments];
        writeQueueToFile(queue, guildDescriptor);
    }
}

function swapQueueItems (index1, index2, queueArray) {
    // Checks if indexes are numbers
    index1 = parseInt(index1);
    index2 = parseInt(index2);
    if((isNaN(index1) || isNaN(index2))){
        throw new Error("At least one of the queue numbers you gave were not numbers.")
    }

    index1 -= 1;
    index2 -= 1;
    let temp;

    // Check if numbers are within range and not the currently playing song
    if ((index1 > (queueArray.length - 1) || index2 > (queueArray.length - 1)) && !(index1 < 0) && !(index2 < 0)){
        throw new Error("You queue numbers you gave were out of range of the queue.");
    } else if (index1 === 0 || index2 === 0) {
        throw new Error("You cannot swap the first element of the first queue item.");
    } else { // Swaps elements
        temp = queueArray[index1];
        queueArray[index1] = queueArray[index2];
        queueArray[index2] = temp;
    }
}

function stripQueueItem(newQueueItem) {
    newQueueItem = newQueueItem.split(" ");
    newQueueItem.shift();
    newQueueItem = newQueueItem.join(" ");
    return newQueueItem;
}

// Tests
// writeQueueToFile(["123, asd"], 925067998811811891)
// readQueueFromFile("1234")

module.exports = {
    readQueueFromFile,
    writeQueueToFile,
    queueFileExists,
    addToQueue,
    addToFrontOfQueue,
    stripQueueItem,
    replaceFrontOfQueue,
    swapQueueItems,
    removeFrontOfQueue,
    insertIntoQueue,
}