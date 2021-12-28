const { joinVoiceChannel, createAudioPlayer, getVoiceConnection, AudioPlayerStatus, createAudioResource} = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

async function plays(client, message, voiceChannel) {
    console.log("play command executed");
    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (permissions.has("CONNECT") && permissions.has("SPEAK") && !message.author.bot) {
        if ((message.content.split(" ").length) !== 1) {
            message.channel.send("Joining Channel now");

            joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            })

            const videoFinder = async (search) => {
                const result = await ytSearch(search);
                return (result.videos.length > 1) ? result.videos[0] : null
            }

            let video = await videoFinder(message.content.replace("!play", ""));

            if(video){
                const stream = ytdl(video.url, {filter: "audioonly"});
                const player = createAudioPlayer();
                const resource = createAudioResource(stream, undefined);

                player.play(resource);
                getVoiceConnection(message.guild.id, "default").subscribe(player);

                player.on(AudioPlayerStatus.Idle, () =>{
                    getVoiceConnection(message.guild.id, "default").destroy();
                })

            }
        } else if(!message.author.bot) { //When there are no arguments with the play command
            message.channel.send("fRICE off! You need more arguments than that!");
        }
    }
}

module.exports = {
    plays,
};