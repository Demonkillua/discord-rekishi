const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	name: "ping",
	description: "Replies with Pong!",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const pongEmbed = new Discord.MessageEmbed()
			.setTitle('Pong!')
			.setAuthor({
				name: `${interaction.member.user.username}`,
				iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}`
		})
			.setColor('RANDOM')
			.setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency is ${Math.round(interaction.client.ws.ping)}ms`);

		await interaction.reply({
			embeds: [pongEmbed],
			ephemeral: true,
		});
	},
};