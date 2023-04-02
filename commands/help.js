const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get some help information."),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`Help`)
            .addFields(
                { name: "/8ball", value: "Ask the a question", inline: true },
                { name: "/balance", value: "View your on hand currency", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/ban", value: "Ban a user\n[\`BanMembers\` permission required]", inline: true },
                { name: "/beg", value: "Beg for some free currency\n[15 minute cooldown]", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/clear", value: "Clear recent messages\n[\`ManageMessages\` permission required]", inline: true },
                { name: "/guess", value: "Guess a number game", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/help", value: "Access this information", inline: true },
                { name: "/kick", value: "Kick a member\n{\`KickMembers\` permission required]", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/ping", value: "Check for bot activity", inline: true },
                { name: "/roll", value: "Roll some dice, or a die", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/server", value: "View current server information", inline: true },
                { name: "/setgoodbye", value: "Set or delete a goodbye channel\n[\`ManageGuild\` permission required]", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "/setwelcome", value: "Set or delete a welcome channel\n[\`ManageGuild\` permission required]", inline: true },
                { name: "/user", value: "View your user information", inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
            )
        await interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true,
        });
    },
};