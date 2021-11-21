
const Discord = require("discord.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});


client.login(process.env.TOKEN);