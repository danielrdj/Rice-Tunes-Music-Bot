const {getVoiceConnection} = require("@discordjs/voice");
const {writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");

function leave(client, message) {
    const guildDescriptor = message.guildId;
    try {
        getVoiceConnection(message.guild.id, "default").destroy();
        writeQueueToFile([], guildDescriptor);
    } catch (err) {
        message.channel.send("You are not connected to a voice channel.");
    }
}

module.exports = {
    leave,
};