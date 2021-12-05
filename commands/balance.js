const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Replies with server stats."),
    async execute(interaction) {
        let profileData;
        try {
            profileData = await profileModel.findOne({ userID: interaction.user.id, serverID: interaction.guild.id });
        } catch (err) {
            console.log(err);
        }

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`${interaction.member.user.username}`)
            .addFields(
                { name: 'Wallet: ', value: `Copper: ${profileData.copper}\nSilver: ${profileData.silver}\nGold: ${profileData.gold}\nPlatinum: ${profileData.platinum}` },
                { name: 'Bank: ', value: `${profileData.bank}` }
            )
            .setFooter(`Find your balance with /balance`);

        await interaction.reply({
            embeds: [newEmbed],
            ephemeral: true,
        });
    },
};