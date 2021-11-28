const Discord = require("discord.js");
const profileModel = require('../models/profileSchema')

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		// member.guild.channels.cache.get("911780529924362252").send(`${member.user} has joined the server!`)
		const newMemberEmbed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setTitle("New Member")
			.setDescription(`${member.user} has joined the server! We hope you enjoy your stay!`)
			.setAuthor(`${member.user.username}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
			.setTimestamp();

		member.guild.channels.cache.get("911780529924362252").send({ embeds: [newMemberEmbed] });

		profileData = await profileModel.findOne({ userID: member.id, serverID: member.guild.id });
		if (!profileData) {
			let profile = await profileModel.create({
				userID: member.id,
				serverID: member.guild.id,
				userName: member.user.username,
				serverName: member.guild.name,
				copper: 1000,
				silver: 0,
				gold: 0,
				platinum: 0,
				bank: 0,
				totalCopper: 1000,
				totalSilver: 0,
				totalGold: 0,
				totalPlatinum: 0,
				exp: 0,
				level: 1,
				inventory: {
					head: null,
					neck: null,
					cloak: null,
					hands: null,
					ring1: null,
					ring2: null,
					belt: null,
					feet: null,
					lhand: null,
					rhand: null,
					bag: [

					],
				},
			});
			profile.save();
		}
    }
};