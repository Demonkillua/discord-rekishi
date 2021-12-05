const Discord = require("discord.js");
const serverSettingsModel = require("../models/serverSettingsSchema")

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		const randomMessage = Math.floor(Math.random() * 7);
		const goodbyeMessage = [
			`${member.user} has left the server!\nIt's a shame to see you go!`,
			`It was good to know you while it lasted.\nGoodbye, ${member.user}!`,
			`It's the simple things in life.\nGoodbye, ${member.user}!`,
			`${member.user} tried to sneak out, but he didn't escape my perception. Goodbye!`,
			`${member.user} has left the server.\nCome back soon!`,
			`${member.user} was slain and a new chracter is requried.\nMaybe they will raise another day, goodbye.`,
			`Quick! We need healing!\n${member.user} is leaving us.`,
			`Goodbye's can open up new opportunities, but it will still be sad to see you go, ${member.user}`
		];
		const memberLeftEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Goodbye!")
			.setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
			.setDescription(goodbyeMessage[randomMessage])
			.setTimestamp();

			const serverSettingsData = await serverSettingsModel.findOne({ serverId: member.guild.id });
			if (!serverSettingsData) {
				let serverSettings = await serverSettingsModel.create({
					serverId: member.guild.id,
					welcomeChannelId: null,
					goodbyeChannelId: null,
				});
				var channelId = null
			} else var channelId = serverSettingsData.welcomeChannelId;
			if (channelId !== null) member.guild.channels.cache.get(`${channelId}`).send({ embeds: [memberLeftEmbed] });
	}
};