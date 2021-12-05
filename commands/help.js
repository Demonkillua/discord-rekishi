const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get some help information.'),
    async execute(interaction) {
        const helpEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Help`)
            .addFields(
                { name: "/balance", value: "View your on hand currency", inline: true },
                { name: "/beg", value: "Beg for some free currency\n[2 hour cooldown]", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/clear", value: `Clear recent messages\n[\`MANAGE MESSAGES\` permission required]`, inline: true },
                { name: "/help", value: "Access this information", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/ping", value: "Check for bot activity", inline: true },
                { name: "/server", value: "View current server information", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/setwelcome", value: "Set or delete a welcome channel\n[\`MANAGE_GUILD\` permission required]", inline: true },
                { name: "/user", value: "View your user information", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
            )
        await interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true,
        });
    },
};