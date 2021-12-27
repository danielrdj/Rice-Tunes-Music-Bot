require("dotenv").config
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

let name = "play";
let description = "RiceTune Bot will join and play music from youtube when this command is run";
function playMusic(message, args) {
    const voiceChannel = message.members.voice.channel;

    if(!voiceChannel){
        return message.channel.send("You need to be in a voice channel to execute this command!")
    }
    //console.log(message + args);
}



module.exports = {
    name,
    description,
    playMusic,
};