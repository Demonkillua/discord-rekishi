const { Discord, Collection } = require("discord.js");
const profileModel = require("../../models/profileSchema");
const cooldowns = new Map;

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

		let profileData;
		try {
			profileData = await profileModel.findOne({ userID: interaction.user.id, serverID: interaction.guild.id });
			if (!profileData) {
				let profile = await profileModel.create({
					userID: interaction.user.id,
					serverID: interaction.guild.id,
					userName: interaction.user.username,
					serverName: interaction.guild.name,
					contributor: false,
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
			}
		} catch (err) {
			console.log(err);
		}

		if (interaction.isStringSelectMenu()) {
			const selected = interaction.values[0];
			if (interaction.customId === "pathfinderSong" || "pathfinderSong1" || "pathfinderSong2" || "pathfinderSong3") {
				const VoiceChannel = interaction.member.voice.channel;
        		if (!VoiceChannel) return interaction.reply({ content: 'You need to be in a voice channel to use the music command!', ephemeral: true });

				client.distube.play(VoiceChannel, selected, { textChannel: interaction.channel, member: interaction.member });
                await interaction.update({ content: "🎶 Processing Request 🎶", ephemeral: true });
			}
			else return interaction.reply({ content: "Something went wrong with this selection menu", ephemeral:true });
		}
		
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const current_time = Date.now();
		const time_stamps = cooldowns.get(command.name);
		const cooldown_amount = (command.cooldown) * 1000;

		if (time_stamps.has(interaction.user.id + interaction.guild.id)) {
			const expiration_time = time_stamps.get(interaction.user.id + interaction.guild.id) + cooldown_amount;

			if (current_time < expiration_time) {
				const time_left = (expiration_time - current_time) / 1000;
				var days = Math.floor(time_left.toFixed(1) / 86400);
				var hours = Math.floor((time_left.toFixed(1) - (days * 86400)) / 3600);
				var minutes = Math.floor((time_left.toFixed(1) - (days * 86400) - (hours * 3600)) / 60);
				var seconds = Math.ceil(time_left.toFixed(1) - (days * 86400) - (hours * 3600) - (minutes * 60));

				if (days >= 1) {
					return interaction.reply({ content: `${interaction.member.displayName}, please wait **${days}** day(s), **${hours}** hour(s), **${minutes}** minute(s), and **${seconds}** second(s) to use \`/${command.name}\` again.`, ephemeral: true })
				} else if (hours >= 1) {
					return interaction.reply({ content: `${interaction.member.displayName}, please wait **${hours}** hour(s), **${minutes}** minute(s), and **${seconds}** second(s) to use \`/${command.name}\` again.`, ephemeral: true })
				} else if (minutes >= 1) {
					return interaction.reply({ content: `${interaction.member.displayName}, please wait **${minutes}** minute(s) and **${seconds}** second(s) to use \`/${command.name}\` again.`, ephemeral: true })
				} else return interaction.reply({ content: `${interaction.member.displayName}, please wait **${Math.ceil(time_left.toFixed(1))}** more second(s) to use \`/${command.name}\` again.`, ephemeral: true })
			}
		}

		time_stamps.set(interaction.user.id + interaction.guild.id, current_time);
		setTimeout(() => time_stamps.delete(interaction.user.id + interaction.guild.id), cooldown_amount);

		try {
			await command.execute(interaction, client, profileData);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
		}
	}
};