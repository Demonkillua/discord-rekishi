require("dotenv").config();
const profileModel = require("../../models/profileSchema");
const prefix = process.env.PREFIX;
const cooldowns = new Map;

module.exports = async (Discord, client, message) => {
    if (message.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id, serverID: message.guild.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                contributor: false,
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

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if (time_stamps.has(message.author.id + message.guild.id)) {
        const expiration_time = time_stamps.get(message.author.id + message.guild.id) + cooldown_amount;

        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;
            var days = Math.floor(time_left.toFixed(1) / 86400);
            var hours = Math.floor((time_left.toFixed(1) - (days * 86400)) / 3600);
            var minutes = Math.floor((time_left.toFixed(1) - (days * 86400) - (hours * 3600)) / 60);
            var seconds = Math.ceil(time_left.toFixed(1) - (days * 86400) - (hours * 3600) - (minutes * 60));

            if (days >= 1) {
                return message.channel.send(`${message.member.displayName}, please wait **${days}** day(s), **${hours}** hour(s), **${minutes}** minute(s), and **${seconds}** second(s) to use the \`${prefix}${command.name}\` command again.`)
            } else if (hours >= 1) {
                return message.channel.send(`${message.member.displayName}, please wait **${hours}** hour(s), **${minutes}** minute(s), and **${seconds}** second(s) to use the \`${prefix}${command.name}\` command again.`)
            } else if (minutes >= 1) {
                return message.channel.send(`${message.member.displayName}, please wait **${minutes}** minute(s) and **${seconds}** second(s) to use the \`${prefix}${command.name}\` command again.`)
            } else return message.channel.send(`${message.member.displayName}, please wait **${Math.ceil(time_left.toFixed(1))}** more second(s) to use the \`${prefix}${command.name}\` command again.`)
        }
    }

    time_stamps.set(message.author.id + message.guild.id, current_time);
    setTimeout(() => time_stamps.delete(message.author.id + message.guild.id), cooldown_amount);

    try {
        command.execute(message, args, cmd, client, Discord);
    } catch (err) {
        message.reply("There was an error trying to execute this command!");
        console.log(err);
    }
}