const qrw = require("../support-js-files/queueReadingAndWriting");
const ytdl = require("ytdl-core");
const {pause} = require("./pause");
const ytSearch = require("yt-search");
const DiscordVoice = require('@discordjs/voice');
const {getVoiceConnection} = require("@discordjs/voice");
const {addToQueue, stripQueueItem} = require("../support-js-files/queueReadingAndWriting");



let videoFinder = async (query) => {
    const videoResult = await ytSearch(query);
    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
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
    if((message.content.split(" ").length === 1)) {
        if (currentPlayerState === "paused") {
            pause(client, message);
            return;
        } else if (!(currentPlayerState === "paused")) {
            message.channel.send("You should check to see if the music is playing or add a search.");
            return;
        }
    } else if (!(message.content.split(" ").length === 1) && currentPlayerState === "paused") {
        pause(client, message);
        message.channel.send("The music has been un-paused and your song has been added to the queue.");
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
        })
        // debugging print
        // console.log(DiscordVoice.getVoiceConnection(guildDescriptor).state.status);

        const video = await videoFinder(qrw.readQueueFromFile(guildDescriptor)[0]);

        let ytdlOptions = {
            filter: "audioonly",
            liveBuffer: "200",
            highWaterMark: 33554432,
        }

        if (video) {
            const stream = await ytdl(video.url, ytdlOptions).on("error", () => {console.log("error in ytdl");});
            const player = DiscordVoice.createAudioPlayer();
            const resource = await DiscordVoice.createAudioResource(stream, undefined); //error location
            //resource.playStream.on("error", (err) => {console.log("There was a big error"); console.error(err);}); //error location
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

async function playOrStop(currentQueue, message, player){
    let ytdlOptions = {
        filter: "audioonly",
        liveBuffer: "200",
        highWaterMark: 33554432,
    }

    if (currentQueue.length === 0) {
        getVoiceConnection(message.guild.id, "default").destroy();
        return message.channel.send("The music has stopped playing.");
    } else {
        const video = await videoFinder(currentQueue[0]); // removed await from videoFinder
        message.channel.send(("Now playing: ").concat(video.url));
        player.play(DiscordVoice.createAudioResource(await ytdl(video.url, ytdlOptions).on("error", () => {console.log("error in ytdl")})));
    }
}


module.exports = {
    play,
    videoFinder,
    playOrStop,
};