async function help (client, message) {
    let commandGreeting = "The following commands can be used to control the RiceTunes bot: \n"
    let bigLine = "-----------------------------------"
    commandGreeting = commandGreeting.concat(bigLine).concat("\n");
    let commands = [
        "!help/!commands      ----> !h",
        "!clear                             ----> !c",
        "!leave/!stop                 ----> !l",
        "!pause                           ----> !pa",
        "!play                              ----> !p",
        "!playFirst                      ----> !pf",
        "!playInstead                ----> !pi",
        "!queueLength              ----> !ql",
        "!queueMove                ----> !qm",
        "!queuePrint                  ----> !qp",
        "!queueSwap                ----> !qs",
        "!skip                              ----> !s",
    ];
    for (let i = 0; i < commands.length; ++i) {
        commandGreeting = commandGreeting.concat(commands[i]).concat("\n");
    }
    message.channel.send(commandGreeting + bigLine);
}


module.exports = {
    help,
};