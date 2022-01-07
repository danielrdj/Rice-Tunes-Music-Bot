const qrw = require("../support-js-files/queueReadingAndWriting");
const ytdl = require("ytdl-core");
const DiscordVoice = require('@discordjs/voice');
const {getVoiceConnection} = require("@discordjs/voice");
const {addToQueue, stripQueueItem, writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");
const {hasArgsAndIsPaused, videoFinder} = require("../support-js-files/playingSupport")
const ytdlOptions = {
    filter: "audioonly",
    liveBuffer: "2000",
    highWaterMark: 33554432,
}

async function playOrStop(currentQueue, message, player){
    if (currentQueue.length === 0 || currentQueue[0] === "") {
        getVoiceConnection(message.guild.id, "default").destroy();
        return message.channel.send("The end of the queue has been reached.");
    } else {
        const video = await videoFinder(currentQueue[0]); // removed await from videoFinder
        let videoName = video.title;
        message.channel.send(("Now playing: ").concat("**" + videoName + "**").concat("\n").concat(video.url));
        player.play(DiscordVoice.createAudioResource(await ytdl(video.url, ytdlOptions).on("error", () =>
        {console.log("error in ytdl")})));
    }
}

async function play(client, message) {
    const guildDescriptor = message.guildId;

    let currentPlayerState; // Player State
    let currentState; // Voice Connection State

    // Tries to assign states
    try {
        currentPlayerState = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
    } catch (err) {currentPlayerState = ""}
    try {
        currentState = DiscordVoice.getVoiceConnection(guildDescriptor).state.status;
    } catch (err) {currentState = undefined;}

    // Checks if there were no additional arguments and if player is paused to unpause
    if(await hasArgsAndIsPaused(client,message,currentPlayerState, "play")){
        return;
    }

    // Adding to queue
    let newQueueItem = stripQueueItem(message.content);
    const video = await videoFinder(newQueueItem);
    let videoName = video.title;
    addToQueue(guildDescriptor, videoName);

    // Connects to channel and creates player object and listener for playing next song
    if(currentState === undefined || currentState === "destroyed" || currentState === "disconnected"){
        DiscordVoice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        }).on("disconnected", () => {
            writeQueueToFile([], guildDescriptor);
            getVoiceConnection(message.guild.id, "default").destroy();
        })

        //const video = await videoFinder(qrw.readQueueFromFile(guildDescriptor)[0]);

        if (video) {
            const stream = await ytdl(video.url, ytdlOptions).on("error", () => {console.error()});
            const player = DiscordVoice.createAudioPlayer();
            const resource = await DiscordVoice.createAudioResource(stream, undefined); //error location
            player.on("error", (error) =>{
                console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
            })
            player.play(resource);
            message.channel.send(("Now playing: ").concat("**" + videoName + "**").concat("\n").concat(video.url));

            // Subscribes player to voice channel
            getVoiceConnection(message.guild.id, "default").subscribe(player.on(
                DiscordVoice.AudioPlayerStatus.Idle, async () => {
                    let currentQueue = qrw.readQueueFromFile(guildDescriptor)
                    currentQueue.shift();
                    qrw.writeQueueToFile(currentQueue, guildDescriptor);
                    await playOrStop(currentQueue, message, player);
                }
            ));
        }
    }
}

module.exports = {
    play,
    videoFinder,
    playOrStop,
};