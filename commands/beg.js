const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const profileModel = require("../models/profileSchema");

module.exports = {
    name: "beg",
    cooldown: 7200,
	data: new SlashCommandBuilder()
		.setName("beg")
		.setDescription("beg for currency."),
	async execute(interaction) {
        const randomCopper = Math.floor(Math.random() * 50) + 1;
        const randomSilver = Math.floor(Math.random() * 10);
        const randomGold = Math.floor(Math.random() * 1);
        const response = await profileModel.findOneAndUpdate(
        {
            userID: interaction.member.user.id,
            serverID: interaction.member.guild.id,
        },
        {
            $inc: {
            copper: randomCopper,
            silver: randomSilver,
            gold: randomGold,
            totalCopper: randomCopper,
            totalCopper: randomSilver,
            totalCopper: randomGold,
            },
        }
        );

        const randomBegged = Math.floor(Math.random() * 10);
        const begged = [
            "begged and received",
            "made it big this time around and got",
            "stuck gold and received",
            "made out alright and received",
            "were noticed by another begger and received",
            "were pitied by a kind soul and gained",
            "almost lost hope until someone took pity upon you. You gained",
            "got noticed by a rich man and received",
            "got noticed by a rich woman and received",
            "were on the streets for hours, but you made"
        ]
        if (randomGold > 0) {
            var begReply = interaction.reply(`**${interaction.user.username}**, you ${begged[randomBegged]} **${randomGold}** gold, **${randomSilver}** silver, and **${randomCopper}** copper.`)
        } else if (randomGold < 1 && randomSilver > 0) {
            var begReply = interaction.reply(`**${interaction.user.username}**, you ${begged[randomBegged]} **${randomSilver}** silver and **${randomCopper}** copper.`)
        } else var begReply = interaction.reply(`**${interaction.user.username}**, you ${begged[randomBegged]} **${randomCopper}** copper.`)

        await begReply;
    },
};