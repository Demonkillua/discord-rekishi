const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Replies with user stats."),
	async execute(interaction) {
		await interaction.reply({
			content: `Your tag: ${interaction.user.tag}`
				+ `\nYour id: ${interaction.user.id}`,
			ephemeral: true
		});
	},
};