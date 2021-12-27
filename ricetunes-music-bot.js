require("dotenv").config();
const {Client, Intents} = require("discord.js");

myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS);
intents = {intents: myIntents}
client = new Client(intents)


client.once("ready", () =>{
    console.log("Bot has come online.");
})






client.login(process.env.BOT_TOKEN)