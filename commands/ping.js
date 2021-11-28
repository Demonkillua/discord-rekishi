const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const pongEmbed = new Discord.MessageEmbed()
            .setTitle('Pong!')
            .setAuthor(`${interaction.member.user.username}`, `${interaction.member.user.displayAvatarURL({ dynamic: true })}`, '')
            .setColor('RANDOM')
            .setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms.`); 
            // API Latency is ${Math.round(client.ws.ping)}ms);
		
		await interaction.reply({
			embeds: [pongEmbed],
			ephemeral: true,
		});
	},
};