const Discord = require("discord.js");
const profileModel = require('../models/profileSchema')
const serverSettingsModel = require('../models/serverSettingsSchema')

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const randomMessage = Math.floor(Math.random() * 14);
		const welcomeMessage = [
			`${member.user} has joined the server!\nWe hope you enjoy your stay!`,
			`Who's that new member!?\n...it's ${member.user}!!!`,
			`You must all be wonding why I've gathered you here today. The reason is to welcome ${member.user} to the server!`,
			`If I got 5 copper pieces each time ${member.user} joined the server. I'd, at least, be 5 copper pieces richer right now.`,
			`🎶 ${member.user} came in like a wreaking ball! 🎶`,
			`Werewolf? Where wolf!? There wolf!\nOh, it's just ${member.user}.`,
			`Another member, another adventure.\nWelcome, ${member.user}!`,
			`We throw our glass down for another!\nWelcome, ${member.user}!`,
			`With great power, comes great responsibility.\nIn this case it's ${member.user} joining the server.`,
			`We have waited so long to have you among us.\nAt last, ${member.user} has joined us!`,
			`Sometimes you just need an awesome member to join to make things complete.\nWelcome, ${member.user}!`,
			`I don't know if it's closer to a natural 1 or a natural 20, but ${member.user} is here to join the adventure!`,
			`This server is like a box of chocolates.\nYou never know what kind of member you're going to get.\nWelcome, ${member.user}!`,
			`Sometimes, life hands you lemons.\nOther times, you get ${member.user}.\nWelcome to the server!`,
			`${member.user} tried to sneak into the server.\nTo bad my perception is much higher.\nWelcome to the server!`,
		];

		const newMemberEmbed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setTitle("New Member!")
			.setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
			.setDescription(`${welcomeMessage[randomMessage]}`)
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
		if (channelId !== null) member.guild.channels.cache.get(`${channelId}`).send({ embeds: [newMemberEmbed] });

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