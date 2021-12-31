const qrw = require("../support-js-files/queueReadingAndWriting");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const DiscordVoice = require('@discordjs/voice');
const {getVoiceConnection} = require("@discordjs/voice");
const {readQueueFromFile, addToQueue} = require("../support-js-files/queueReadingAndWriting");


async function play(client, message, voiceChannel) {
    const permissions = voiceChannel.permissionsFor(message.client.user);
    const guildDescriptor = message.guildId;
    let newQueueItem = message.content;
    newQueueItem = newQueueItem.split(" ");
    newQueueItem.shift();
    newQueueItem = newQueueItem.join(" ");

    if (!(permissions.has("CONNECT") && permissions.has("SPEAK"))){
        message.channel.send("You don't have the correct permissions for this channel");
        return;
    }
    addToQueue(guildDescriptor, newQueueItem);

    let currentState;
    try {
        currentState = DiscordVoice.getVoiceConnection(guildDescriptor).state.status;
    } catch {
        currentState = undefined;
    }
    if(currentState === undefined || currentState === "destroyed" || currentState === "disconnected"){
        DiscordVoice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })

        console.log(DiscordVoice.getVoiceConnection(guildDescriptor).state.status);
        let videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(qrw.readQueueFromFile(guildDescriptor)[0]);

        if (video) {
            const stream = ytdl(video.url, {filter: "audioonly"});
            const player = DiscordVoice.createAudioPlayer();
            const resource = DiscordVoice.createAudioResource(stream, undefined);
            player.play(resource);
            console.log(DiscordVoice.getVoiceConnection(guildDescriptor).state);
            getVoiceConnection(message.guild.id, "default").subscribe(player.on(
                DiscordVoice.AudioPlayerStatus.Idle, async () => {
                    let currentQueue = qrw.readQueueFromFile(guildDescriptor)
                    currentQueue.shift();
                    qrw.writeQueueToFile(currentQueue, guildDescriptor);
                    if (currentQueue.length === 0) {
                        getVoiceConnection(message.guild.id, "default").destroy();
                        return message.channel.send("The music has stopped playing.");
                    } else {
                        const video = await videoFinder(currentQueue[0]);
                        player.play(DiscordVoice.createAudioResource(ytdl(video.url, {filter: "audioonly"}), undefined));
                    }
                }
            ))
        }
    }
}


module.exports = {
    play,
};