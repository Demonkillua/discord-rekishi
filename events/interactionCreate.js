const { Embed } = require("@discordjs/builders");
const Discord = require("discord.js");
const profileModel = require("../models/profileSchema");
const cooldowns = new Map();

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		let profileData;
    	try {
        	profileData = await profileModel.findOne({ userID: interaction.user.id, serverID: interaction.guild.id });
        	if (!profileData) {
            	let profile = await profileModel.create({
                	userID: interaction.user.id,
                	serverID: interaction.guild.id,
					userName: interaction.user.username,
					serverName: interaction.guild.name,
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

		if (!interaction.isCommand()) return;

	    const command = interaction.client.commands.get(interaction.commandName);

	    if (!command) return;

		const errorEmbed = new Discord.MessageEmbed().setColor("RED");

		if (!interaction.guild.me.permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])) {
			errorEmbed.setDescription(`I don't doesn't have the \`SEND_MESSAGES\` or \`EMBED_LINKS\` permissions so execute ${command.name} of the ${interaction.channel.toString()} channel.`)
			return await interaction.member.send({ embeds: [errorEmbed], ephemeral: true })
		}
		if (!interaction.member.permissions.has(command.permissions || [])) {
			errorEmbed.setDescription(`You need the following permissions \`\`\`${command.permissions.join(", ")}\`\`\``)
			return await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
		}
		if (!interaction.guild.me.permissions.has(command.botPerms || [])) {
			errorEmbed.setDescription(`The bot does not have there permissions \`\`\`${command.permissions.join(", ")}\`\`\``)
			return await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
		}
		const channelPerms = interaction.channel.permissionsFor(interaction.guild.me).toArray();
		const checkArr = [];
		const chPerms = command.chnlPerms || [];
		channelPerms.forEach((x) => (chPerms.includes(x) ? checkArr.push(true) : checkArr.push(false)))
		if (checkArr.includes(false) && !checkArr.includes(true) && chPerms.length) {
			errorEmbed.setDescription(`The bot doesn't have these permissions on the ${interaction.channel.toString()} channel \`\`\`${chPerms.join(", ")}\`\`\``)
			return await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
		}

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
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
					return interaction.reply({ content: `${interaction.user.username}, please wait **${days}** day(s), **${hours}** hour(s), **${minutes}** minute(s), and **${seconds}** second(s) to use \`/${command.name}\` again.`, ephemeral: true })
				} else if (hours >= 1) {
					return interaction.reply({ content: `${interaction.user.username}, please wait **${hours}** hour(s), **${minutes}** minute(s), and **${seconds}** second(s) to use \`/${command.name}\` again.`, ephemeral: true })
				} else if (minutes >= 1) {
					return interaction.reply({ content: `${interaction.user.username}, please wait **${minutes}** minute(s) and **${seconds}** second(s) to use \`/${command.name}\` again.`, ephemeral: true })
				} else return interaction.reply({ content: `${interaction.user.username}, please wait **${Math.ceil(time_left.toFixed(1))}** more second(s) to use \`/${command.name}\` again.`, ephemeral: true})
			}
		}
	
		time_stamps.set(interaction.user.id + interaction.guild.id, current_time);
		setTimeout(() => time_stamps.delete(interaction.user.id + interaction.guild.id), cooldown_amount);

	    try {
		    await command.execute(interaction, Discord);
	    } catch (err) {
		    if (err) console.error(err);
		    await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
	    }
    }
};