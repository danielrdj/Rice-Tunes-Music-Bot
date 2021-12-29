const { joinVoiceChannel, createAudioPlayer, getVoiceConnection, AudioPlayerStatus, createAudioResource, getGroups } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const {queueFileExists, writeQueueToFile, readQueueFromFile} = require("../support-js-files/queueReadingAndWriting");




async function play(client, message) {
    console.log("play command executed");

    let voiceChannel = message.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(message.client.user);
    let arguments = message.content.split(" ");
    arguments.shift();
    arguments = arguments.join(" ");

    let guildQueueName = message.guildId;

    if (queueFileExists(message.guildId)){
        let queue = readQueueFromFile(message.guildId);
        if (queue[0] === ""){
            queue.shift();
        }
        queue.push(arguments);
        writeQueueToFile(queue, guildQueueName);
    } else {
        let queue = [arguments];
        writeQueueToFile(queue, guildQueueName);
    }

    //Finding the channelId of the bot
    let botChannelId;
    try {
        botChannelId = getGroups().entries();
        botChannelId = botChannelId.next().value[1].entries();
        botChannelId = botChannelId.next().value[1].joinConfig.channelId
    } catch {
        botChannelId = undefined;
    }
    if(!(botChannelId === message.channelId) && !message.author.bot){
        if (permissions.has("CONNECT") && permissions.has("SPEAK")) {
            if ((message.content.split(" ").length) !== 1) {
                message.channel.send("Joining Channel now");

                joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                })

            }
        } else if(!message.author.bot) { //When there are no arguments with the play command
            message.channel.send("fRICE off! You need more arguments than that!");
        }

        const videoFinder = async (search) => {
            const result = await ytSearch(search);
            return (result.videos.length > 1) ? result.videos[0] : null;
        }

        let video = await videoFinder(readQueueFromFile((guildQueueName))[0]);

        if(video){
            const stream = ytdl(video.url, {filter: "audioonly"});
            const player = createAudioPlayer();
            const resource = createAudioResource(stream, undefined);

            player.play(resource);
            getVoiceConnection(message.guild.id, "default").subscribe(player);

            player.on(AudioPlayerStatus.Idle, () =>{
                //getVoiceConnection(message.guild.id, "default").destroy();
            })
        }
    }
}

module.exports = {
    play,
};