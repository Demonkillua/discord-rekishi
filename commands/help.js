const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get some help information.'),
    async execute(interaction) {
        const helpEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`${interaction.member.user.username}`)
            .setDescription('Help')
            .addFields(
                { name: "/help", value: "Access this information", inline: true }
            )
        await interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true,
        });
    },
};