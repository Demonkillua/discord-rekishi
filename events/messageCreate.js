require("dotenv").config();
const profileModel = require("../models/profileSchema");
const prefix = process.env.PREFIX;

module.exports = async (message, client, Discord) => {
    if (message.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id, serverID: message.guild.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                copper: 1000,
                silver: 0,
                gold: 0,
                platinum: 0,
                bank: 0,
                totalCopper: 1000,
                totalSilver: 0,
                totalGold: 0,
                totalPlatinum: 0,
                exp: 0,
                level: 1,
                inventory: {
                    head: null,
                    neck: null,
                    cloak: null,
                    hands: null,
                    ring1: null,
                    ring2: null,
                    belt: null,
                    feet: null,
                    lhand: null,
                    rhand: null,
                    bag: [

                    ],
                },
            });
        }
    } catch (err) {
        console.log(err);
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) ||
        client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    // mongodb above here for message exp and etc.
    if (!message.content.startsWith(prefix)) return;

    if (!command) return;

    try {
        command.execute(message, args, cmd, client, Discord, profileData);
    } catch (err) {
        message.reply("There was an error trying to execute this command!");
        console.log(err);
    }
}