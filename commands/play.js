const qrw = require("../support-js-files/queueReadingAndWriting");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const DiscordVoice = require('@discordjs/voice');
const {getVoiceConnection} = require("@discordjs/voice");
const {addToQueue, stripQueueItem, writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");
const {hasArgsAndIsPaused} = require("../support-js-files/playingSupport")
let ytdlOptions = {
    filter: "audioonly",
    liveBuffer: "2000",
    highWaterMark: 33554432,
}

let videoFinder = async (query) => {
    const videoResult = await ytSearch(query);
    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
}

async function playOrStop(currentQueue, message, player){

    if (currentQueue.length === 0 || currentQueue[0] === "") {
        getVoiceConnection(message.guild.id, "default").destroy();
        return message.channel.send("The end of the queue has been reached.");
    } else {
        const video = await videoFinder(currentQueue[0]); // removed await from videoFinder
        message.channel.send(("Now playing: ").concat(video.url));
        player.play(DiscordVoice.createAudioResource(await ytdl(video.url, ytdlOptions).on("error", () => {console.log("error in ytdl")})));
    }
}

async function play(client, message, voiceChannel) {
    const guildDescriptor = message.guildId;

    let currentPlayerState; // Player State
    let currentState; // Voice Connection State

    // Tries to assign states
    try {
        currentPlayerState = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
    } catch {currentPlayerState = ""}
    try {
        currentState = DiscordVoice.getVoiceConnection(guildDescriptor).state.status;
    } catch {currentState = undefined;}

    // Checks if there were no additional arguments and if player is paused to unpause
    if(hasArgsAndIsPaused(client,message,currentPlayerState, "play")){
        return;
    }

    // Checks permissions for playing in voice channel
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!(permissions.has("CONNECT") && permissions.has("SPEAK"))){
        message.channel.send("You don't have the correct permissions for this channel");
        return;
    }

    // Adding to queue
    let newQueueItem = stripQueueItem(message.content);
    addToQueue(guildDescriptor, newQueueItem);

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

        const video = await videoFinder(qrw.readQueueFromFile(guildDescriptor)[0]);

        if (video) {
            const stream = await ytdl(video.url, ytdlOptions).on("error", () => {console.error()});
            const player = DiscordVoice.createAudioPlayer();
            const resource = await DiscordVoice.createAudioResource(stream, undefined); //error location
            player.on("error", (error) =>{
                console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
            })
            player.play(resource);
            message.channel.send(("Now playing: ").concat(video.url));

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