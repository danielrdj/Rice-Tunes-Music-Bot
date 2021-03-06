const {pause} = require("../commands/pause");
const {queueLength} = require("../commands/queueLength");
const {stripQueueItem} = require("../support-js-files/queueReadingAndWriting")
const ytSearch = require("yt-search");

async function videoFinder(query){
    const videoResult = await ytSearch(query);
    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
}

async function hasArgsAndIsPaused(client, message, currentPlayerState, currentMethodName) {
    currentMethodName = currentMethodName.toLowerCase();
    let messageLength = message.content.split(" ").length;
    let messageContent = stripQueueItem(message.content);
    let video = await videoFinder(messageContent);
    let videoName = video.title;
    let isPlay = currentMethodName === "play";
    let isPlayFirst = currentMethodName === "playfirst";
    let isPlayInstead = currentMethodName === "playinstead";
    let condition1;
    let condition2;
    let condition3;
    let condition4;

    if (isPlay){
        condition1 = "The music has been un-paused.";
        condition2 = `The music has been un-paused and **${videoName}** will be added to the end of the queue.`;
        condition3 = `**${videoName}** has been added to the end of the queue.`;
        condition4 = "You should check to see if the music is playing or add a search.";
    } else if (isPlayFirst){
        condition1 = "You didn't give an song query.";
        condition2 = `The music has been un-paused and **${videoName}** will now play.`;
        condition2 = condition2.concat(" The song that was paused will be next.");
        condition3 = `**${videoName}** will now be played. The song that was just playing will be next.`;
        condition4 = "There must be music actively playing or paused in order to use this command.";
    } else if (isPlayInstead) {
        condition1 = "You didn't give an song query.";
        condition2 = `The music has been un-paused and **${videoName}** will now play.`;
        condition2 = condition2.concat(" The song that was paused has been removed from the queue.");
        condition3 = `**${videoName}** will now be played. The song that was just playing has been removed from the queue.`;
        condition4 = "There must be music actively playing or paused in order to use this command.";
    } else {
        condition1 = " ";
        condition2 = " ";
        condition3 = " ";
        condition4 = " ";
    }

    if (messageLength === 1) {
        if (isPlay && currentPlayerState === "paused"){
            message.channel.send(condition1);
            pause(client, message);
        } else if (!isPlay && currentPlayerState === "paused") {
            message.channel.send(condition1);
        } else {
            message.channel.send(condition4);
        }
        return true;
    } else if (!(messageLength === 1) && currentPlayerState === "paused") {
        pause(client, message);
        message.channel.send(condition2);
    } else if ((currentPlayerState === "playing")) {
        message.channel.send(condition3);
        if (isPlay){
            message.channel.send("The queue is now " + (queueLength(client, message) + 1) + " items in length.");
        }
    } else {
        if (!isPlay) {
            message.channel.send(condition4);
        }
    }
}

module.exports = {
    hasArgsAndIsPaused,
    videoFinder,
}