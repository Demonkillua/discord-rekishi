const Discord = require("discord.js");

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		// member.guild.channels.cache.get("911780529924362252").send(`${member.user} has joined the server!`)
		const memberLeftEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Member Left")
			.setDescription(`${member.user} has left the server! It's a shame to see you go!`)
			.setAuthor(`${member.user.username}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
			.setTimestamp();

		member.guild.channels.cache.get("911780529924362252").send({ embeds: [memberLeftEmbed] });
    }
};