const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Moderation: Ban a user from the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName("target").setDescription("The target user to ban")),
    async execute(interaction) {
        const target = interaction.options.getMember("target");

        if (target) {
            const memberTarget = interaction.guild.members.cache.get(target.id)
            memberTarget.ban();
            interaction.reply({ content: `${target} has been banned from the server.`, ephemeral: true })
        } else return;
    },
};