const DiscordVoice = require("@discordjs/voice");

function pause(client, message) {
    const guildDescriptor = message.guildId;
    let voiceStatus;

    try {
        voiceStatus = DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.state.status;
        // console.log(voiceStatus);
        if(voiceStatus === "paused"){
            DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.unpause();
        } else {
            DiscordVoice.getVoiceConnection(guildDescriptor).state.subscription.player.pause();
        }
    } catch (err) {}
}

module.exports = {
    pause,
};