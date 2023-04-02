const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Replies with server stats."),
	async execute(interaction) {
		await interaction.reply({
			content: `Server name: ${interaction.guild.name}`
				+ `\nTotal members: ${interaction.guild.memberCount}`
				+ `\nServer created: ${interaction.guild.createdAt}`
				+ `\nServer verification level: ${interaction.guild.verificationLevel}`,
			ephemeral: true
		});
	},
};