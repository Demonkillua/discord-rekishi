const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    permissions: ["KICK_MEMBERS"],
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Moderation: Kick a user from the server")
        .addUserOption(option => option.setName("target").setDescription("The target user to ban")),
    async execute(interaction, message, args) {
        if (args === "kick") return;
        const target = interaction.options.getMember("target");

        if (target) {
            const memberTarget = interaction.guild.members.cache.get(target.id)
            memberTarget.kick();
            interaction.reply({ content: `${target} has been kicked from the server.`, ephemeral: true })
        } else return;
    },
};