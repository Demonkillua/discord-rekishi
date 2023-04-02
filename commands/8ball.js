const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Asks a question and let the bot determine your fate")
        .addStringOption(option => option.setName("question").setDescription("Ask a question!").setRequired(true)),
    async execute(interaction) {
        const replies = ['Yes', 'No', 'Never', 'Definitely', 'Ask again later', 'That\'s a negative', 'You already know the answer to that one', 'Affirmative', '21', 'Best not to look'];

        const result = Math.floor(Math.random() * replies.length);
        const question = interaction.options.getString("question");
        const resultEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.member.user.username}`,
                iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}`
            })
            .setColor('White')
            .addFields(
                { name: "Question", value: question },
                { name: "The 🎱 Ball says...", value: replies[result] },
            )
        await interaction.reply({ embeds: [resultEmbed] });
    },
};