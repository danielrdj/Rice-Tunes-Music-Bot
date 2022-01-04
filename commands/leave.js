const {getVoiceConnection} = require("@discordjs/voice");
const {writeQueueToFile} = require("../support-js-files/queueReadingAndWriting");

function leave(client, message) {
    const guildDescriptor = message.guildId;
    getVoiceConnection(message.guild.id, "default").destroy();
    writeQueueToFile([],guildDescriptor);
}

module.exports = {
    leave,
};