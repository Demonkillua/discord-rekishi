const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    permissions: ["BAN_MEMBERS"],
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Moderation: Ban a user from the server")
        .addUserOption(option => option.setName("target").setDescription("The target user to ban")),
    async execute(interaction, message, args) {
        if (args === "ban") return;
        const target = interaction.options.getMember("target");

        if (target) {
            const memberTarget = interaction.guild.members.cache.get(target.id)
            memberTarget.ban();
            interaction.reply({ content: `${target} has been banned from the server.`, ephemeral: true })
        } else return;
    },
};