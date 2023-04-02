const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const pongEmbed = new EmbedBuilder()
			.setTitle('Pong!')
			.setAuthor({
				name: `${interaction.member.user.username}`,
				iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}`
		})
			.setColor('Random')
			.setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency is ${Math.round(interaction.client.ws.ping)}ms`);

		await interaction.reply({
			embeds: [pongEmbed],
			ephemeral: true,
		});
	},
};