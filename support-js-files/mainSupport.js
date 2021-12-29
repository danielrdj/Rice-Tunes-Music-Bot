function retrieveCommand (str) {
    return str.split(" ")[0].substring(1);
}

function commandHasArguments (str) {
    return (str.length !== 1)
}

module.exports = {
    retrieveCommand,
    commandHasArguments,
};