//Finding the channelId of the bot
const {getGroups} = require("@discordjs/voice");
let botChannelId;
try {
    botChannelId = getGroups().entries();
    botChannelId = botChannelId.next().value[1].entries();
    botChannelId = botChannelId.next().value[1].joinConfig.channelId
} catch (err) {
    botChannelId = undefined;
}