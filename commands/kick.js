const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Moderation: Kick a user from the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName("target").setDescription("The target user to ban")),
    async execute(interaction) {
        const target = interaction.options.getMember("target");

        if (target) {
            const memberTarget = interaction.guild.members.cache.get(target.id)
            memberTarget.kick();
            interaction.reply({ content: `${target} has been kicked from the server.`, ephemeral: true })
        } else return;
    },
};