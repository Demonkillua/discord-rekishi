const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema")

module.exports = {
    name: "balance",
    description: "Replies with current currency balance",
    aliases: ["bal", "bl"],
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Replies with current currency balance"),
    async execute(interaction) {
        let profileData = await profileModel.findOne({ userID: interaction.member.user.id, serverID: interaction.member.guild.id });

        const newEmbed = new EmbedBuilder()
            .setColor('#32a852')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`${interaction.member.user.username}`)
            .addFields(
                { name: 'Wallet: ', value: `Copper: ${profileData.copper}\nSilver: ${profileData.silver}\nGold: ${profileData.gold}\nPlatinum: ${profileData.platinum}` },
                { name: 'Bank: ', value: `${profileData.bank}` }
            )
            .setFooter({ text: `Find your balance with /balance` });

        await interaction.reply({
            embeds: [newEmbed],
            ephemeral: true,
        });
    },
};